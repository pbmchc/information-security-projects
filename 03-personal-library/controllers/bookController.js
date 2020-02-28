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