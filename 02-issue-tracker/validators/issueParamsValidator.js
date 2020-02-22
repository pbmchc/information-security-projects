'use strict';

const { query } = require('express-validator');
const { createErrorMessage } = require('../helpers/errorHelper');

const INVALID_PARAM_ERROR = 'Invalid query param';

module.exports = [
    query(['created_on', 'updated_on'])
        .optional({checkFalsy: true})
        .isISO8601()
        .withMessage((_, { path }) => createErrorMessage(INVALID_PARAM_ERROR, path)),
    query('open')
        .optional()
        .isBoolean()
        .withMessage((_, { path }) => createErrorMessage(INVALID_PARAM_ERROR, path))
];