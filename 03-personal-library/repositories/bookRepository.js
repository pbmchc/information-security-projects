'use strict';

const Book = require('../models/book');

const SAVING_BOOK_ERROR_MESSAGE = 'Error while saving book';
const FETCHING_BOOKS_ERROR_MESSAGE = 'Error while fetching books';
const FETCHING_BOOK_ERROR_MESSAGE = 'Error while fetching book';
const FETCHING_BOOK_MISSING_MESSAGE = 'No book exists';
const DELETING_BOOK_SUCCESS_MESSAGE = 'Delete successful';
const DELETING_BOOK_ERROR_MESSAGE = 'Error while deleting book';
const DELETING_BOOKS_ERROR_MESSAGE = 'Error while deleting books';
const DELETING_BOOKS_SUCCESS_MESSAGE = 'Complete delete successful';

function createBook(book, done) {
    const newBook = new Book(book);

    newBook.save((err, result) => {
        if(err) {
            return done({msg: SAVING_BOOK_ERROR_MESSAGE});
        }

        done(null, _mapSingleBook(result));
    });
}

function getBookById(id, done) {
    Book.exists({_id: id}, (_, result) => {
        if(!result) {
            return done({msg: FETCHING_BOOK_MISSING_MESSAGE});
        }

        Book.findById(id, (err, result) => {
            if(err) {
                return done({msg: FETCHING_BOOK_ERROR_MESSAGE}); 
            }

            done(null, _mapSingleBook(result));
        });
    });
}

function deleteBook({id}, done) {
    Book.deleteOne({_id: id}, err =>
        err
            ? done({msg: DELETING_BOOK_ERROR_MESSAGE})
            : done(null, DELETING_BOOK_SUCCESS_MESSAGE)
    );
}

function getBooks(done) {
    Book.find({}, (err, result) => {
        if(err) {
            return done({msg: FETCHING_BOOKS_ERROR_MESSAGE});
        }

        done(null, result.map(_mapBooks));
    });
}

function deleteBooks(done) {
    Book.deleteMany({}, (err) =>
        err ? done({msg: DELETING_BOOKS_ERROR_MESSAGE})
            : done(null, DELETING_BOOKS_SUCCESS_MESSAGE));
}

function _mapSingleBook({_id, title}) {
    return ({
        _id,
        title
    });
}

function _mapBooks({_id, title, comments}) {
    return ({
        _id,
        title,
        commentcount: comments.length
    });
}

exports.createBook = createBook;
exports.getBookById = getBookById;
exports.deleteBook = deleteBook;
exports.getBooks = getBooks;
exports.deleteBooks = deleteBooks;