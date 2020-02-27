'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

const bookController = require('../controllers/bookController');

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
    .post(bookController.addBook)
    .delete(bookController.deleteBooks);



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
