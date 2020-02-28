'use strict';

const {body} = require('express-validator');
const {createErrorMessage} = require('../helpers/errorHelper');

const MISSING_REQUIRED_ERROR = 'Missing required field';

const createBookValidator = [
    body(['title'])
        .not()
        .isEmpty()
        .withMessage((_, {path}) =>
            createErrorMessage(MISSING_REQUIRED_ERROR, path))
];

const updateBookCommentsValidator = [
    body(['comment'])
        .not()
        .isEmpty()
        .withMessage((_, {path}) =>
            createErrorMessage(MISSING_REQUIRED_ERROR, path))
];

exports.createBookValidator = createBookValidator;
exports.updateBookCommentsValidator = updateBookCommentsValidator;