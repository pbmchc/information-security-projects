import { VALIDATION_ERRORS } from '../constants/validationErrors.js';

export const CONVERTER_ERRORS = {
  ALL: 'invalid number and unit',
  UNIT: 'invalid unit',
  VALUE: 'invalid number',
};

export class ConverterInputValidator {
  validate(value, unit) {
    const errors = {
      value: value === VALIDATION_ERRORS.INVALID,
      unit: unit === VALIDATION_ERRORS.INVALID,
    };

    if (errors.value && errors.unit) return { error: CONVERTER_ERRORS.ALL };
    if (errors.value) return { error: CONVERTER_ERRORS.VALUE };
    if (errors.unit) return { error: CONVERTER_ERRORS.UNIT };

    return null;
  }
}
