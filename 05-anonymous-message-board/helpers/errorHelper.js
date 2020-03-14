'use strict';

const HTTP_ERROR_CODES = require('../constants/httpErrorCodes');

function prepareErrorPayload(message, status = HTTP_ERROR_CODES.BAD_REQUEST) {
    return {
        message,
        status
    };
}

function createErrorMessage(message, field) {
    return `${message}: ${field}`;
}

exports.createErrorMessage = createErrorMessage;
exports.prepareErrorPayload = prepareErrorPayload;