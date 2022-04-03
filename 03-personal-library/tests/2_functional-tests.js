const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const bookRepository = require('../repositories/bookRepository');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  let id = '';
  const title = 'TESTING_BOOK_TITLE';
  const book = {title};

  suite('Routing tests', () => {
    beforeEach((done) => {
      bookRepository.createBook(book, (_, {_id}) => {
        id = _id;
        done();
      });
    });

    afterEach((done) => {
      bookRepository.deleteBook({id}, () => {
        id = '';
        done();
      });
    });

    suite('POST /api/books with title => create book object/expect book object', () => {
      test('Test POST /api/books with title', (done) => {
        chai.request(server)
          .post('/api/books')
          .send(book)
          .end((_, {body, status}) => {
            const {_id, comments, title: bookTitle} = body;

            assert.equal(status, 200);
            assert.isObject(body, 'Response should be an object');
            assert.isDefined(_id, 'Book should contain id');
            assert.isArray(comments, 'Book comments should be an array');
            assert.lengthOf(comments, 0, 'Book comments should be empty');
            assert.equal(bookTitle, title);

            bookRepository.deleteBook({id: _id}, () => done());
          });
      });
      
      test('Test POST /api/books with no title given', (done) => {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end((_, {status, text}) => {
            assert.equal(status, 400);
            assert.equal(text, 'Missing required field: title');
            done();
          });
      });
    });


    suite('GET /api/books => array of books', () => {
      test('Test GET /api/books',  (done) => {
        chai.request(server)
          .get('/api/books')
          .end((_, {body, status}) => {
            assert.equal(status, 200);
            assert.isArray(body, 'Response should be an array');
            assert.property(body[0], 'commentcount', 'Books in array should contain comment count');
            assert.property(body[0], 'title', 'Books in array should contain title');
            assert.property(body[0], '_id', 'Books in array should contain id');
            done();
          });
      });      
    });


    suite('GET /api/books/[id] => book object with [id]', () => {
      test('Test GET /api/books/[id] with id not in db',  (done) => {
        const invalidIdentifier = 'INVALID_IDENTIFIER';

        chai.request(server)
          .get(`/api/books/${invalidIdentifier}`)
          .end((_, {status, text}) => {
            assert.equal(status, 400);
            assert.equal(text, 'No book exists');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  (done) => {
        chai.request(server)
          .get(`/api/books/${id}`)
          .end((_, {body, status}) => {
            const {_id, comments, title: bookTitle} = body;
    
            assert.equal(status, 200);
            assert.isObject(body, 'Response should be an object');
            assert.isArray(comments, 'Book comments should be an array');
            assert.lengthOf(comments, 0, 'Book comments should be empty');
            assert.equal(_id.toString(), id);
            assert.equal(bookTitle, title);
            done();
          });
      });
      
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', () => {
      test('Test POST /api/books/[id] with comment', (done) => {
        const comment = 'NEW_COMMENT';

        chai.request(server)
          .post(`/api/books/${id}`)
          .send({comment})
          .end((_, {body, status}) => {
            const {_id, comments, title: bookTitle} = body;
            
            assert.equal(status, 200);
            assert.isObject(body, 'Response should be an object');
            assert.isArray(comments, 'Book comments should be an array');
            assert.lengthOf(comments, 1, 'Book comments should have one comment');
            assert.equal(comments[0], comment);
            assert.equal(_id.toString(), id);
            assert.equal(bookTitle, title);
            done();
          });
      });

      test('Test POST /api/books/[id] with empty comment body', (done) => {
        chai.request(server)
          .post(`/api/books/${id}`)
          .send({})
          .end((_, {status, text}) => {
            assert.equal(status, 400);
            assert.equal(text, 'Missing required field: comment');
            done();
          });
      });
    });
  });
});
