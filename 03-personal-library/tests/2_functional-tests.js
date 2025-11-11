import * as chai from 'chai';
import chaiHttp, { request } from 'chai-http';

import { createBook, deleteBook } from '../repositories/bookRepository.js';
import app from '../server.js';

const { assert } = chai;
chai.use(chaiHttp);

suite('Functional Tests', () => {
  let TEST_BOOK_ID = '';
  const TEST_BOOK_TITLE = 'TEST_BOOK_TITLE';

  beforeEach(async () => {
    await createBook({ title: TEST_BOOK_TITLE }).then(({ _id }) => (TEST_BOOK_ID = _id));
  });

  afterEach(async () => {
    await deleteBook({ id: TEST_BOOK_ID }).then(() => (TEST_BOOK_ID = ''));
  });

  suite('Routing tests', () => {
    suite('POST /api/books with title => create book object/expect book object', () => {
      test('Test POST /api/books with title', async () => {
        const newTestBook = { title: 'NEW_TEST_BOOK_TITLE' };
        const { body, status } = await request.execute(app).post('/api/books').send(newTestBook);
        const { _id, comments, title } = body;

        assert.equal(status, 200);
        assert.isObject(body, 'Response should be an object');
        assert.isDefined(_id, 'Book should contain id');
        assert.isArray(comments, 'Book comments should be an array');
        assert.lengthOf(comments, 0, 'Book comments should be empty');
        assert.equal(title, newTestBook.title);

        await deleteBook({ id: _id });
      });

      test('Test POST /api/books with no title given', async () => {
        const { status, text } = await request.execute(app).post('/api/books').send({});

        assert.equal(status, 400);
        assert.equal(text, 'Missing required field: title');
      });
    });

    suite('GET /api/books => array of books', () => {
      test('Test GET /api/books', async () => {
        const { body, status } = await request.execute(app).get('/api/books');

        assert.equal(status, 200);
        assert.isArray(body, 'Response should be an array');
        assert.property(body[0], 'commentcount', 'Books in array should contain comment count');
        assert.property(body[0], 'title', 'Books in array should contain title');
        assert.property(body[0], '_id', 'Books in array should contain id');
      });
    });

    suite('GET /api/books/[id] => book object with [id]', () => {
      test('Test GET /api/books/[id] with id not in db', async () => {
        const nonExistentIdentifier = '0'.repeat(24);
        const { status, text } = await request
          .execute(app)
          .get(`/api/books/${nonExistentIdentifier}`);

        assert.equal(status, 404);
        assert.equal(text, 'No book exists');
      });

      test('Test GET /api/books/[id] with valid id in db', async () => {
        const { body, status } = await request.execute(app).get(`/api/books/${TEST_BOOK_ID}`);
        const { _id, comments, title } = body;

        assert.equal(status, 200);
        assert.isObject(body, 'Response should be an object');
        assert.isArray(comments, 'Book comments should be an array');
        assert.lengthOf(comments, 0, 'Book comments should be empty');
        assert.equal(_id.toString(), TEST_BOOK_ID);
        assert.equal(title, TEST_BOOK_TITLE);
      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', () => {
      test('Test POST /api/books/[id] with comment', async () => {
        const comment = 'NEW_COMMENT';
        const { body, status } = await request
          .execute(app)
          .post(`/api/books/${TEST_BOOK_ID}`)
          .send({ comment });
        const { _id, comments, title } = body;

        assert.equal(status, 200);
        assert.isObject(body, 'Response should be an object');
        assert.isArray(comments, 'Book comments should be an array');
        assert.lengthOf(comments, 1, 'Book comments should have one comment');
        assert.equal(comments[0], comment);
        assert.equal(_id.toString(), TEST_BOOK_ID);
        assert.equal(title, TEST_BOOK_TITLE);
      });

      test('Test POST /api/books/[id] with empty comment body', async () => {
        const { status, text } = await request
          .execute(app)
          .post(`/api/books/${TEST_BOOK_ID}`)
          .send({});

        assert.equal(status, 400);
        assert.equal(text, 'Missing required field: comment');
      });
    });
  });
});
