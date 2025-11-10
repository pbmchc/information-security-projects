import { query } from 'express-validator';

import { toValidationErrorMessage } from '../utils/errorUtils.js';

const INVALID_PARAM_ERROR = 'Invalid query param';

export const createIssuesParamsValidationChain = () => {
  return [
    query(['created_on', 'updated_on'])
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage((_, { path }) => toValidationErrorMessage(path, INVALID_PARAM_ERROR)),
    query('open')
      .optional()
      .isBoolean()
      .withMessage((_, { path }) => toValidationErrorMessage(path, INVALID_PARAM_ERROR)),
  ];
};
