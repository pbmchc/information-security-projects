'use strict';

const {validationResult} = require('express-validator');
const {prepareErrorPayload} = require('../helpers/errorHelper');
const bookRepository = require('../repositories/bookRepository');

function addBook(req, res, next) {
    const {body} = req;
    const {errors: [err]} = validationResult(req);

    if(err) {
        return next(prepareErrorPayload(err.msg));
    }

    bookRepository.createBook(body, (err, result) => {
        if(err) {
            return next(prepareErrorPayload(err.msg));
        }

        res.json(result);
    });
}

function getSingleBook({params}, res, next) {
    const {id} = params;

    bookRepository.getBookById(id, (err, result) => {
        if(err) {
            return next(prepareErrorPayload(err.msg));
        }

        res.json(result);
    });
}

function deleteBook({params}, res, next) {
    bookRepository.deleteBook(params, (err, result) => {
        if(err) {
            return next(prepareErrorPayload(err.msg));
        }

        res.send(result);
    });
}

function getBooks(_, res, next) {
    bookRepository.getBooks((err, result) => {
        if(err) {
            return next(prepareErrorPayload(err.msg));
        }

        res.json(result);
    });
}

function deleteBooks(_, res, next) {
    bookRepository.deleteBooks((err, result) => {
        if(err) {
            return next(prepareErrorPayload(err.msg));
        }

        res.send(result);
    });
}

exports.addBook = addBook;
exports.getSingleBook = getSingleBook;
exports.deleteBook = deleteBook;
exports.getBooks = getBooks;
exports.deleteBooks = deleteBooks;