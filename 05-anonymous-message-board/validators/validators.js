'use strict';

const {body} = require('express-validator');
const {createErrorMessage} = require('../helpers/errorHelper');

const REQUIRED_THREAD_FIELDS = ['text', 'delete_password'];
const REQUIRED_THREAD_REPLY_FIELDS = [...REQUIRED_THREAD_FIELDS, 'thread_id'];
const MISSING_REQUIRED_ERROR = 'Missing required field';

function validate(fields) {
    return [
        body(fields)
            .not()
            .isEmpty()
            .withMessage((_, {path}) =>
                createErrorMessage(MISSING_REQUIRED_ERROR, path))
    ];
}

exports.threadValidator = validate(REQUIRED_THREAD_FIELDS);
exports.threadReplyValidator = validate(REQUIRED_THREAD_REPLY_FIELDS);