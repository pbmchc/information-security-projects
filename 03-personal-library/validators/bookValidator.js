'use strict';

const {body} = require('express-validator');
const {createErrorMessage} = require('../helpers/errorHelper');

const MISSING_BOOK_TITLE_ERROR = 'Missing required field';

const createBookValidator = [
    body(['title'])
        .not()
        .isEmpty()
        .withMessage((_, {path}) =>
            createErrorMessage(MISSING_BOOK_TITLE_ERROR, path))
];

exports.createBookValidator = createBookValidator;