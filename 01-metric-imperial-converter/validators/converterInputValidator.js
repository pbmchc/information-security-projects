'use strict';

const VALIDATION_ERRORS = require('../constants/validationErrors');

const CONVERTER_ERROR_MESSAGES = {
    ALL: 'invalid number and unit',
    UNIT: 'invalid unit',
    VALUE: 'invalid number'
};

function validate(value, unit) {
    const errors = {
        value: value === VALIDATION_ERRORS.INVALID,
        unit: unit === VALIDATION_ERRORS.INVALID
    };

    if(errors.value && errors.unit) {
        return {error: CONVERTER_ERROR_MESSAGES.ALL};
    }

    if(errors.value) {
        return {error: CONVERTER_ERROR_MESSAGES.VALUE};
    }

    return errors.unit ? {error: CONVERTER_ERROR_MESSAGES.UNIT} : null;
}

module.exports = {validate};