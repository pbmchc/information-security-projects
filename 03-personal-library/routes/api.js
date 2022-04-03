'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

const bookController = require('../controllers/bookController');
const {createBookValidator, updateBookCommentsValidator} = require('../validators/bookValidator');

mongoose.connect(
  process.env.DB,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

module.exports = function (app) {
  app.route('/api/books')
    .get(bookController.getBooks)
    .post(createBookValidator, bookController.addBook)
    .delete(bookController.deleteBooks);

  app.route('/api/books/:id')
    .get(bookController.getSingleBook)
    .post(updateBookCommentsValidator, bookController.updateBookComments)
    .delete(bookController.deleteBook);
  
};
