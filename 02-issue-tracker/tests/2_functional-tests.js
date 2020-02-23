const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const {createIssue, deleteIssue} = require('../repositories/issueRepository');

const TEST_PROJECT_TITLE = '__test__';
const TEST_PROJECT_REQUEST_URL = `/api/issues/${TEST_PROJECT_TITLE}`;
const BASE_ISSUE = {
  issue_title: 'Title',
  issue_text: 'text',
  created_by: 'Functional Test - Every field filled in',
};
const FULL_ISSUE = {
  ...BASE_ISSUE,
  assigned_to: 'Chai and Mocha',
  status_text: 'In QA'
};
const TEST_ISSUE = {
  ...FULL_ISSUE,
  project: TEST_PROJECT_TITLE
};

chai.use(chaiHttp);

suite('Functional Tests', () => {
    beforeEach((done) => {
      deleteIssue({project: TEST_PROJECT_TITLE}, () => done());
    });

    suite('POST /api/issues/{project} => object with issue data', () => {
      test('Every field filled in', (done) => {
       chai.request(server)
        .post(TEST_PROJECT_REQUEST_URL)
        .send(FULL_ISSUE)
        .end((_, {body, status}) => {
          assert.equal(status, 200);
          assert.isOk(body);
          assert.isObject(body);
          assert.include(body, FULL_ISSUE);
          done();
        });
      });
      
      test('Required fields filled in', (done) => {
        chai.request(server)
          .post(TEST_PROJECT_REQUEST_URL)
          .send(BASE_ISSUE)
          .end((_, {body, status}) => {
            assert.equal(status, 200);
            assert.isOk(body);
            assert.isObject(body);
            assert.include(body, BASE_ISSUE);
            done();
          });
      });
      
      test('Missing required fields', (done) => {
        const {issue_title, issue_text} = BASE_ISSUE;
        const incompleteIssue = {issue_title, issue_text};

        chai.request(server)
          .post(TEST_PROJECT_REQUEST_URL)
          .send(incompleteIssue)
          .end(({response: {status, text}}) => {          
            assert.equal(status, 400);
            assert.equal(text, 'Missing required field: created_by');
            done();
          });
      });
    
    });
    
    suite('PUT /api/issues/{project} => text', () => {      
      test('No body', (done) => {
        chai.request(server)
          .put(TEST_PROJECT_REQUEST_URL)
          .send({})
          .end(({response: {status, text}}) => {          
            assert.equal(status, 400);
            assert.equal(text, 'No updated field sent');
            done();
          });
      });
      
      test('One field to update', (done) => {
        createIssue(TEST_ISSUE, (_, {_id}) => {
          const updatedIssue = {_id, issue_title: 'New title'};

          chai.request(server)
            .put(TEST_PROJECT_REQUEST_URL)
            .send(updatedIssue)
            .end((_, {status, text}) => {          
              assert.equal(status, 200);
              assert.equal(text, `Successfully updated ${_id}`);
              done();
            });
        });
      });
      
      test('Multiple fields to update', (done) => {
        createIssue(TEST_ISSUE, (_, {_id}) => {
          const updatedIssue = {_id, issue_title: 'New title', issue_text: 'New text', open: false};

          chai.request(server)
            .put(TEST_PROJECT_REQUEST_URL)
            .send(updatedIssue)
            .end((_, {status, text}) => {          
              assert.equal(status, 200);
              assert.equal(text, `Successfully updated ${_id}`);
              done();
            });
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', () => {
      test('No filter', (done) => {
        createIssue(TEST_ISSUE, () => {
          chai.request(server)
            .get(TEST_PROJECT_REQUEST_URL)
            .query({})
            .end((_, {body, status}) => {
              assert.equal(status, 200);
              assert.isArray(body);
              assert.lengthOf(body, 1);
              assert.property(body[0], 'issue_title');
              assert.property(body[0], 'issue_text');
              assert.property(body[0], 'created_on');
              assert.property(body[0], 'updated_on');
              assert.property(body[0], 'created_by');
              assert.property(body[0], 'assigned_to');
              assert.property(body[0], 'open');
              assert.property(body[0], 'status_text');
              assert.property(body[0], '_id');
              done();
            });
        });
      });
      
      test('One filter', (done) => {
        createIssue({...TEST_ISSUE, open: false}, () => {
          chai.request(server)
            .get(TEST_PROJECT_REQUEST_URL)
            .query({open: false})
            .end((_, {body, status}) => {
              assert.equal(status, 200);
              assert.isArray(body);
              assert.lengthOf(body, 1);
              assert.isFalse(body[0].open);
              done();
            });
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', (done) => {
        const issue_title = 'Test title';
        const issue_text = 'Test text';
  
        createIssue({...TEST_ISSUE, issue_title, issue_text}, () => {
          chai.request(server)
            .get(TEST_PROJECT_REQUEST_URL)
            .query({issue_title, issue_text})
            .end((_, {body, status}) => {
              assert.equal(status, 200);
              assert.isArray(body);
              assert.lengthOf(body, 1);
              assert.equal(body[0].issue_title, issue_title);
              assert.equal(body[0].issue_text, issue_text);
              done();
            });
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', () => {
      test('No _id', (done) => {
        chai.request(server)
          .delete(TEST_PROJECT_REQUEST_URL)
          .send({})
          .end(({response: {status, text}}) => {          
            assert.equal(status, 400);
            assert.equal(text, 'Id error');
            done();
          });
      });
      
      test('Valid _id', (done) => {
        createIssue(TEST_ISSUE, (_, {_id}) => {
          chai.request(server)
            .delete(TEST_PROJECT_REQUEST_URL)
            .send({_id})
            .end((_, {status, text}) => {          
              assert.equal(status, 200);
              assert.equal(text, `Deleted ${_id}`);
              done();
            });
        });
      });
    });
});
