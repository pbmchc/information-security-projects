import { body } from 'express-validator';

import { toValidationErrorMessage } from '../utils/errorUtils.js';

const MISSING_REQUIRED_FIELD_ERROR = 'Missing required field';
const REQUIRED_THREAD_FIELDS = ['text', 'delete_password'];
const REQUIRED_THREAD_REPLY_FIELDS = [...REQUIRED_THREAD_FIELDS, 'thread_id'];

function createValidationChain(fields) {
  return [
    body(fields)
      .not()
      .isEmpty()
      .withMessage((_, { path }) => toValidationErrorMessage(path, MISSING_REQUIRED_FIELD_ERROR)),
  ];
}

export const createThreadValidationChain = () => {
  return createValidationChain(REQUIRED_THREAD_FIELDS);
};

export const createThreadReplyValidationChain = () => {
  return createValidationChain(REQUIRED_THREAD_REPLY_FIELDS);
};
