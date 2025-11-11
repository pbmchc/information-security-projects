import { body } from 'express-validator';

import { toValidationErrorMessage } from '../utils/errorUtils.js';

const MISSING_REQUIRED_FIELD_ERROR = 'Missing required field';

export const createBookValidationChain = () => {
  return [
    body(['title'])
      .not()
      .isEmpty()
      .withMessage((_, { path }) => toValidationErrorMessage(path, MISSING_REQUIRED_FIELD_ERROR)),
  ];
};

export const createBookCommentsValidationChain = () => {
  return [
    body(['comment'])
      .not()
      .isEmpty()
      .withMessage((_, { path }) => toValidationErrorMessage(path, MISSING_REQUIRED_FIELD_ERROR)),
  ];
};
