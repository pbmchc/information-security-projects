import * as chai from 'chai';
import chaiHttp, { request } from 'chai-http';

import { createIssue, deleteIssue } from '../repositories/issueRepository.js';
import app from '../server.js';

const { assert } = chai;
chai.use(chaiHttp);

const TEST_PROJECT_TITLE = '__test__';
const TEST_PROJECT_REQUEST_URL = `/api/issues/${TEST_PROJECT_TITLE}`;

suite('Functional Tests', () => {
  const BASE_ISSUE = {
    issue_title: 'Title',
    issue_text: 'text',
    created_by: 'Functional Test - Every field filled in',
  };
  const FULL_ISSUE = {
    ...BASE_ISSUE,
    assigned_to: 'Chai and Mocha',
    status_text: 'In QA',
  };
  const TEST_ISSUE = {
    ...FULL_ISSUE,
    project: TEST_PROJECT_TITLE,
  };

  beforeEach(async () => {
    await deleteIssue({ project: TEST_PROJECT_TITLE });
  });

  suite('POST /api/issues/{project} => object with issue data', () => {
    test('Every field filled in', async () => {
      const { body, status } = await request
        .execute(app)
        .post(TEST_PROJECT_REQUEST_URL)
        .send(FULL_ISSUE);

      assert.equal(status, 200);
      assert.isOk(body);
      assert.isObject(body);
      assert.include(body, FULL_ISSUE);
    });

    test('Required fields filled in', async () => {
      const { body, status } = await request
        .execute(app)
        .post(TEST_PROJECT_REQUEST_URL)
        .send(BASE_ISSUE);

      assert.equal(status, 200);
      assert.isOk(body);
      assert.isObject(body);
      assert.include(body, BASE_ISSUE);
    });

    test('Missing required fields', async () => {
      const { issue_title, issue_text } = BASE_ISSUE;
      const incompleteIssue = { issue_title, issue_text };

      const { status, text } = await request
        .execute(app)
        .post(TEST_PROJECT_REQUEST_URL)
        .send(incompleteIssue);

      assert.equal(status, 400);
      assert.equal(text, 'Missing required field: created_by');
    });
  });

  suite('PUT /api/issues/{project} => text', () => {
    test('No body', async () => {
      const { status, text } = await request.execute(app).put(TEST_PROJECT_REQUEST_URL).send({});

      assert.equal(status, 400);
      assert.equal(text, 'No updated field sent');
    });

    test('One field to update', async () => {
      const { _id } = await createIssue(TEST_ISSUE);
      const { status, text } = await request
        .execute(app)
        .put(TEST_PROJECT_REQUEST_URL)
        .send({ _id, issue_title: 'New title' });

      assert.equal(status, 200);
      assert.equal(text, `Successfully updated ${_id}`);
    });

    test('Multiple fields to update', async () => {
      const { _id } = await createIssue(TEST_ISSUE);
      const { status, text } = await request
        .execute(app)
        .put(TEST_PROJECT_REQUEST_URL)
        .send({ _id, issue_title: 'New title', issue_text: 'New text', open: false });

      assert.equal(status, 200);
      assert.equal(text, `Successfully updated ${_id}`);
    });
  });

  suite('GET /api/issues/{project} => Array of objects with issue data', () => {
    test('No filter', async () => {
      await createIssue(TEST_ISSUE);

      const { body, status } = await request.execute(app).get(TEST_PROJECT_REQUEST_URL).query({});

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
    });

    test('One filter', async () => {
      await createIssue({ ...TEST_ISSUE, open: false });

      const { body, status } = await request
        .execute(app)
        .get(TEST_PROJECT_REQUEST_URL)
        .query({ open: false });

      assert.equal(status, 200);
      assert.isArray(body);
      assert.lengthOf(body, 1);
      assert.isFalse(body[0].open);
    });

    test('Multiple filters (test for multiple fields you know will be in the db for a return)', async () => {
      const issue_title = 'Test title';
      const issue_text = 'Test text';

      await createIssue({ ...TEST_ISSUE, issue_title, issue_text });

      const { body, status } = await request
        .execute(app)
        .get(TEST_PROJECT_REQUEST_URL)
        .query({ issue_title, issue_text });

      assert.equal(status, 200);
      assert.isArray(body);
      assert.lengthOf(body, 1);
      assert.equal(body[0].issue_title, issue_title);
      assert.equal(body[0].issue_text, issue_text);
    });
  });

  suite('DELETE /api/issues/{project} => text', () => {
    test('No _id', async () => {
      const { status, text } = await request.execute(app).delete(TEST_PROJECT_REQUEST_URL).send({});

      assert.equal(status, 400);
      assert.equal(text, 'Id error');
    });

    test('Valid _id', async () => {
      const { _id } = await createIssue(TEST_ISSUE);
      const { status, text } = await request
        .execute(app)
        .delete(TEST_PROJECT_REQUEST_URL)
        .send({ _id });

      assert.equal(status, 200);
      assert.equal(text, `Deleted ${_id}`);
    });
  });
});
