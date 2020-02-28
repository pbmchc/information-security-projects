'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

const bookController = require('../controllers/bookController');
const {createBookValidator} = require('../validators/bookValidator');

mongoose.connect(
  process.env.DB,
  {
    useNewUrlParser: true,
    useCreateIndex: true
  }
);

module.exports = function (app) {
  app.route('/api/books')
    .get(bookController.getBooks)
    .post(createBookValidator, bookController.addBook)
    .delete(bookController.deleteBooks);

  app.route('/api/books/:id')
    .get(bookController.getSingleBook)
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })
    .delete(bookController.deleteBook);
  
};
