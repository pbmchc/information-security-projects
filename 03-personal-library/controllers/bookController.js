'use strict';

const bookRepository = require('../repositories/bookRepository');
const {prepareErrorPayload} = require('../helpers/errorHelper');

function addBook(req, res, next) {
    const {body} = req;

    bookRepository.createBook(body, (err, result) => {
        if(err) {
            return next(prepareErrorPayload(err.msg));
        }

        res.json(result);
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
exports.getBooks = getBooks;
exports.deleteBooks = deleteBooks;