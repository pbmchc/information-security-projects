import { body } from 'express-validator';

import { toValidationErrorMessage } from '../utils/errorUtils.js';
import { hasFieldValues } from '../utils/validatorUtils.js';

const MISSING_ID_ERROR = 'Id error';
const MISSING_FIELDS_ERROR = 'No updated field sent';
const MISSING_REQUIRED_FIELD_ERROR = 'Missing required field';

export const createIssueCreationValidationChain = () => {
  return [
    body(['issue_title', 'issue_text', 'created_by'])
      .not()
      .isEmpty()
      .withMessage((_, { path }) => toValidationErrorMessage(path, MISSING_REQUIRED_FIELD_ERROR)),
  ];
};

export const createIssueUpdateValidationChain = () => {
  return [body().custom(hasFieldValues).withMessage(MISSING_FIELDS_ERROR)];
};

export const createIssueDeletionValidationChain = () => {
  return [body(['_id']).not().isEmpty().withMessage(MISSING_ID_ERROR)];
};
