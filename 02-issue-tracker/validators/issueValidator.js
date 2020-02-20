'use strict';

const {body} = require('express-validator');
const {createErrorMessage} = require('../helpers/errorHelper');

const MISSING_REQUIRED_FIELD_ERROR = 'Missing required field';

const createIssueValidator = [
    body(['issue_title', 'issue_text', 'created_by'])
        .not()
        .isEmpty()
        .withMessage((_, {path}) =>
            createErrorMessage(MISSING_REQUIRED_FIELD_ERROR, path))
];

module.exports = {createIssueValidator};