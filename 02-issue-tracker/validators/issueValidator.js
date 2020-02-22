'use strict';

const {body} = require('express-validator');
const {createErrorMessage} = require('../helpers/errorHelper');

const MISSING_ID_ERROR = 'Id error';
const MISSING_REQUIRED_FIELD_ERROR = 'Missing required field';

const createIssueValidator = [
    body(['issue_title', 'issue_text', 'created_by'])
        .not()
        .isEmpty()
        .withMessage((_, {path}) =>
            createErrorMessage(MISSING_REQUIRED_FIELD_ERROR, path))
];

const deleteIssueValidator = [
    body(['_id'])
        .not()
        .isEmpty()
        .withMessage(MISSING_ID_ERROR)
];

module.exports = {createIssueValidator, deleteIssueValidator};