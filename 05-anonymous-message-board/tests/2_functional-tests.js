import * as chai from 'chai';
import chaiHttp, { request } from 'chai-http';

import { Thread } from '../models/thread.js';
import * as threadRepository from '../repositories/threadRepository.js';
import app from '../server.js';
import { encrypt } from '../utils/encryptUtils.js';

const { assert } = chai;
chai.use(chaiHttp);

suite('Functional Tests', function () {
  const THREAD_TEST_SUITE_TIMEOUT = 10000;

  const THREAD_TEST_PROJECT_BOARD = '__test__';
  const THREAD_REQUEST_URL = `/api/threads/${THREAD_TEST_PROJECT_BOARD}`;
  const THREAD_REPLY_REQUEST_URL = `/api/replies/${THREAD_TEST_PROJECT_BOARD}`;

  const TEST_THREAD = { text: 'thread', delete_password: 'password' };
  const TEST_THREAD_REPLY = { text: 'reply', delete_password: 'password' };

  this.timeout(THREAD_TEST_SUITE_TIMEOUT);

  async function createTestThread() {
    const { delete_password, text } = TEST_THREAD;

    return threadRepository.createThread({
      text,
      delete_password: await encrypt(delete_password),
      board: THREAD_TEST_PROJECT_BOARD,
    });
  }

  async function createTestThreadReply(id) {
    const { delete_password, text } = TEST_THREAD_REPLY;

    return threadRepository.createThreadReply(
      {
        text,
        delete_password: await encrypt(delete_password),
      },
      id
    );
  }

  async function clearTestThreads() {
    return Thread.deleteMany({ board: THREAD_TEST_PROJECT_BOARD });
  }

  this.beforeEach(async () => {
    await clearTestThreads();
  });

  this.afterAll(async () => {
    await clearTestThreads();
  });

  suite('API ROUTING FOR /api/threads/:board', function () {
    let thread;

    suite('POST', function () {
      test('should return error message when required field is missing', async () => {
        const { delete_password } = TEST_THREAD;
        const { status, text } = await request
          .execute(app)
          .post(THREAD_REQUEST_URL)
          .send({ delete_password });

        assert.equal(status, 400);
        assert.equal(text, 'Missing required field: text');
      });

      test('should redirect to board when thread has been successfully created', async () => {
        const { status, text } = await request
          .execute(app)
          .post(THREAD_REQUEST_URL)
          .redirects(0)
          .send(TEST_THREAD);

        assert.equal(status, 302);
        assert.match(text, new RegExp(`/b/${THREAD_TEST_PROJECT_BOARD}`));
      });
    });

    suite('GET', function () {
      this.beforeEach(async () => {
        await createTestThread();
      });

      test('should return list of latest bumped threads', async () => {
        const { body, status } = await request.execute(app).get(THREAD_REQUEST_URL);

        const [{ replies, replycount, text }] = body;

        assert.equal(status, 200);
        assert.isArray(body);
        assert.equal(body.length, 1);
        assert.isArray(replies);
        assert.equal(replycount, 0);
        assert.equal(text, TEST_THREAD.text);
      });
    });

    suite('DELETE', function () {
      this.beforeEach(async () => {
        thread = await createTestThread();
      });

      test('should return success message when thread has been deleted successfully', async () => {
        const { _id: thread_id } = thread;
        const { delete_password } = TEST_THREAD;
        const { status, text } = await request
          .execute(app)
          .delete(THREAD_REQUEST_URL)
          .send({ delete_password, thread_id });

        assert.equal(status, 200);
        assert.equal(text, 'Success');
      });

      test('should return error message when thread delete password is incorrect', async () => {
        const { _id: thread_id } = thread;
        const { status, text } = await request
          .execute(app)
          .delete(THREAD_REQUEST_URL)
          .send({ delete_password: 'incorrect-password', thread_id });

        assert.equal(status, 403);
        assert.equal(text, 'Incorrect password');
      });
    });

    suite('PUT', function () {
      this.beforeEach(async () => {
        thread = await createTestThread();
      });

      test('should return success message when thread has been reported successfully', async () => {
        const { _id: report_id } = thread;
        const { status, text } = await request
          .execute(app)
          .put(THREAD_REQUEST_URL)
          .send({ report_id });

        assert.equal(status, 200);
        assert.equal(text, 'Success');
      });
    });
  });

  suite('API ROUTING FOR /api/replies/:board', function () {
    let thread;
    let threadWithReplies;

    suite('POST', function () {
      this.beforeEach(async () => {
        thread = await createTestThread();
      });

      test('should return error message when required field is missing', async () => {
        const { status, text } = await request
          .execute(app)
          .post(THREAD_REPLY_REQUEST_URL)
          .send(TEST_THREAD_REPLY);

        assert.equal(status, 400);
        assert.equal(text, 'Missing required field: thread_id');
      });

      test('should redirect to thread board when reply has been successfully created', async () => {
        const { _id: thread_id } = thread;
        const reply = { ...TEST_THREAD_REPLY, thread_id };
        const { status, text } = await request
          .execute(app)
          .post(THREAD_REPLY_REQUEST_URL)
          .redirects(0)
          .send(reply);

        assert.equal(status, 302);
        assert.match(text, new RegExp(`/b/${THREAD_TEST_PROJECT_BOARD}/${thread_id}`));
      });
    });

    suite('GET', function () {
      this.beforeEach(async () => {
        thread = await createTestThread();
        threadWithReplies = await createTestThreadReply(thread._id);
      });

      test('should return single thread with latest replies', async () => {
        const { body, status } = await request
          .execute(app)
          .get(`${THREAD_REPLY_REQUEST_URL}`)
          .query({ thread_id: `${thread._id}` });

        const { replies, text } = body;
        const [{ text: replyText }] = replies;

        assert.equal(status, 200);
        assert.isArray(replies);
        assert.equal(replies.length, 1);
        assert.equal(text, TEST_THREAD.text);
        assert.equal(replyText, TEST_THREAD_REPLY.text);
      });
    });

    suite('PUT', function () {
      this.beforeEach(async () => {
        thread = await createTestThread();
        threadWithReplies = await createTestThreadReply(thread._id);
      });

      test('should return success message when thread has been reported successfully', async () => {
        const {
          _id: thread_id,
          replies: [{ _id: reply_id }],
        } = threadWithReplies;
        const { status, text } = await request
          .execute(app)
          .put(THREAD_REPLY_REQUEST_URL)
          .send({ thread_id, reply_id });

        assert.equal(status, 200);
        assert.equal(text, 'Success');
      });
    });

    suite('DELETE', function () {
      this.beforeEach(async () => {
        thread = await createTestThread();
        threadWithReplies = await createTestThreadReply(thread._id);
      });

      test('should return success message when thread reply has been deleted successfully', async () => {
        const {
          _id: thread_id,
          replies: [{ _id: reply_id }],
        } = threadWithReplies;
        const { delete_password } = TEST_THREAD_REPLY;

        const { status, text } = await request
          .execute(app)
          .delete(THREAD_REPLY_REQUEST_URL)
          .send({ thread_id, reply_id, delete_password });

        assert.equal(status, 200);
        assert.equal(text, 'Success');
      });

      test('should return error message when thread reply delete password is incorrect', async () => {
        const {
          _id: thread_id,
          replies: [{ _id: reply_id }],
        } = threadWithReplies;
        const { status, text } = await request
          .execute(app)
          .delete(THREAD_REPLY_REQUEST_URL)
          .send({ thread_id, reply_id, delete_password: 'incorrect-password' });

        assert.equal(status, 403);
        assert.equal(text, 'Incorrect password');
      });
    });
  });
});
