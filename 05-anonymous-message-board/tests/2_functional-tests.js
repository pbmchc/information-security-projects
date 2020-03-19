const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const Thread = require('../models/thread');
const threadRepository = require('../repositories/threadRepository');
const {encrypt} = require('../helpers/encryptHelper');

const THREAD_TEST_SUITE_TIMEOUT = 10000;
const THREAD_TEST_PROJECT_BOARD = '__test__';
const THREAD_REQUEST_URL = `/api/threads/${THREAD_TEST_PROJECT_BOARD}`;
const THREAD_REPLY_REQUEST_URL = `/api/replies/${THREAD_TEST_PROJECT_BOARD}`;
const THREAD_MOCK = {text: 'thread', delete_password: 'password'};
const THREAD_REPLY_MOCK = {text: 'reply', delete_password: 'password'};

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(THREAD_TEST_SUITE_TIMEOUT);

  this.beforeEach(async () => {
    await clearThreadTestCollection();
  });

  this.afterAll(async () => {
    await clearThreadTestCollection();
  });

  suite('API ROUTING FOR /api/threads/:board', function() {
    let thread;

    suite('POST', function() {
      test('should return error message when required field is missing', (done) => {
        const {delete_password} = THREAD_MOCK;
        
        chai.request(server)
          .post(THREAD_REQUEST_URL)
          .send({delete_password})
          .end(({response: {status, text}}) => {
            assert.equal(status, 400);
            assert.equal(text, 'Missing required field: text');
            done();
          });
      });

      test('should redirect to board when thread has been successfully created', (done) => {        
        chai.request(server)
          .post(THREAD_REQUEST_URL)
          .redirects(0)
          .send(THREAD_MOCK)
          .end((_, {status, text}) => {
            assert.equal(status, 302);
            assert.match(text, new RegExp(`/b/${THREAD_TEST_PROJECT_BOARD}`));
            done();
          });
      });
    });
    
    suite('GET', function() {
      this.beforeEach(async () => {
        await createThreadMock();
      });

      test('should return list of latest bumped threads', (done) => {        
        chai.request(server)
          .get(THREAD_REQUEST_URL)
          .end((_, {body, status}) => {
            const [{replies, replycount, text}] = body;

            assert.equal(status, 200);
            assert.isArray(body);
            assert.equal(body.length, 1);
            assert.isArray(replies);
            assert.equal(replycount, 0);
            assert.equal(text, THREAD_MOCK.text);
            done();
          });
      });
    });
    
    suite('DELETE', function() {
      this.beforeEach(async () => {
        thread = await createThreadMock();
      });

      test('should return success message when thread has been deleted successfully', (done) => {
        const {_id: thread_id} = thread;
        const {delete_password} = THREAD_MOCK;
        
        chai.request(server)
          .delete(THREAD_REQUEST_URL)
          .send({delete_password, thread_id})
          .end((_, {status, text}) => {
            assert.equal(status, 200);
            assert.equal(text, 'success');
            done();
          });
      });

      test('should return error message when thread delete password is incorrect', (done) => {
        const {_id: thread_id} = thread;
        
        chai.request(server)
          .delete(THREAD_REQUEST_URL)
          .send({delete_password: 'incorrect-password', thread_id})
          .end(({response: {status, text}}) => {
            assert.equal(status, 400);
            assert.equal(text, 'Incorrect password');
            done();
          });
      });
    });
    
    suite('PUT', function() {
      this.beforeEach(async () => {
        thread = await createThreadMock();
      });

      test('should return success message when thread has been reported successfully', (done) => {
        const {_id: report_id} = thread;
        
        chai.request(server)
          .put(THREAD_REQUEST_URL)
          .send({report_id})
          .end((_, {status, text}) => {
            assert.equal(status, 200);
            assert.equal(text, 'success');
            done();
          });
      });
    });
  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    let thread;
    let threadWithReplies;

    suite('POST', function() {
      this.beforeEach(async () => {
        thread = await createThreadMock();
      });

      test('should return error message when required field is missing', (done) => {        
        chai.request(server)
          .post(THREAD_REPLY_REQUEST_URL)
          .send(THREAD_REPLY_MOCK)
          .end(({response: {status, text}}) => {
            assert.equal(status, 400);
            assert.equal(text, 'Missing required field: thread_id');
            done();
          });
      });

      test('should redirect to thread board when reply has been successfully created', (done) => {        
        const {_id: thread_id} = thread;
        const reply = {...THREAD_REPLY_MOCK, thread_id};
        
        chai.request(server)
          .post(THREAD_REPLY_REQUEST_URL)
          .redirects(0)
          .send(reply)
          .end((_, {status, text}) => {
            assert.equal(status, 302);
            assert.match(text, new RegExp(`/b/${THREAD_TEST_PROJECT_BOARD}/${thread_id}`));
            done();
          });
      });
    });
    
    suite('GET', function() {
      this.beforeEach(async () => {
        thread = await createThreadMock();
        threadWithReplies = await createThreadReplyMock(thread._id);
      });

      test('should return single thread with latest replies', (done) => {           
        chai.request(server)
          .get(`${THREAD_REPLY_REQUEST_URL}`)
          .query({thread_id: `${thread._id}`})
          .end((_, {body, status}) => {
            const {replies, text} = body;
            const [{text: replyText}] = replies;

            assert.equal(status, 200);
            assert.isArray(replies);
            assert.equal(replies.length, 1);
            assert.equal(text, THREAD_MOCK.text);
            assert.equal(replyText, THREAD_REPLY_MOCK.text);
            done();
          });
      });
    });
    
    suite('PUT', function() {
      this.beforeEach(async () => {
        thread = await createThreadMock();
        threadWithReplies = await createThreadReplyMock(thread._id);
      });

      test('should return success message when thread has been reported successfully', (done) => {
        const {_id: thread_id, replies: [{_id: reply_id}]} = threadWithReplies;
        
        chai.request(server)
          .put(THREAD_REPLY_REQUEST_URL)
          .send({thread_id, reply_id})
          .end((_, {status, text}) => {
            assert.equal(status, 200);
            assert.equal(text, 'success');
            done();
          });
      });
    });
    
    suite('DELETE', function() {
      this.beforeEach(async () => {
        thread = await createThreadMock();
        threadWithReplies = await createThreadReplyMock(thread._id);
      });

      test('should return success message when thread reply has been deleted successfully', (done) => {
        const {_id: thread_id, replies: [{_id: reply_id}]} = threadWithReplies;
        const {delete_password} = THREAD_REPLY_MOCK;
        
        chai.request(server)
          .delete(THREAD_REPLY_REQUEST_URL)
          .send({thread_id, reply_id, delete_password})
          .end((_, {status, text}) => {
            assert.equal(status, 200);
            assert.equal(text, 'success');
            done();
          });
      });

      test('should return error message when thread reply delete password is incorrect', (done) => {
        const {_id: thread_id, replies: [{_id: reply_id}]} = threadWithReplies;
        
        chai.request(server)
          .delete(THREAD_REPLY_REQUEST_URL)
          .send({thread_id, reply_id, delete_password: 'incorrect-password'})
          .end(({response: {status, text}}) => {
            assert.equal(status, 400);
            assert.equal(text, 'Incorrect password');
            done();
          });
      });
    });
    
  });

  async function createThreadMock() {
    const {delete_password, text} = THREAD_MOCK;

    return threadRepository.createThread({
      text,
      delete_password: await encrypt(delete_password),
      board: THREAD_TEST_PROJECT_BOARD
    });
  }

  async function createThreadReplyMock(id) {
    const {delete_password, text} = THREAD_REPLY_MOCK;

    return threadRepository.createThreadReply({
      text,
      delete_password: await encrypt(delete_password)
    }, id);
  }

  async function clearThreadTestCollection() {
    return Thread.deleteMany({board: THREAD_TEST_PROJECT_BOARD});
  }
});
