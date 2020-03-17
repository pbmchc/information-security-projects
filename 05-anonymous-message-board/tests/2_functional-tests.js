const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const THREAD_TEST_PROJECT_BOARD = '__test__';
const THREAD_REQUEST_URL = `/api/threads/${THREAD_TEST_PROJECT_BOARD}`;
const THREAD_MOCK = {text: 'text', delete_password: 'password'};

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('API ROUTING FOR /api/threads/:board', function() {
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
      
    });
    
    suite('DELETE', function() {
      
    });
    
    suite('PUT', function() {
    });
  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    suite('POST', function() {
      
    });
    
    suite('GET', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    
    suite('DELETE', function() {
      
    });
    
  });
});
