import { HTTP_ERROR_CODES } from '../constants/httpErrorCodes.js';

export const CUSTOM_ERROR_TYPES = {
  FORBIDDEN: 'FORBIDDEN',
};

export class CustomError extends Error {
  constructor(message, type) {
    super(message);
    this.name = 'CustomError';
    this.type = type;
  }
}

function toHttpErrorStatus(customErrorType) {
  switch (customErrorType) {
    case CUSTOM_ERROR_TYPES.FORBIDDEN:
      return HTTP_ERROR_CODES.FORBIDDEN;
    default:
      return HTTP_ERROR_CODES.INTERNAL_SERVER_ERROR;
  }
}

export function toHttpError(err) {
  if (err instanceof CustomError) {
    return { message: err.message, status: toHttpErrorStatus(err.type) };
  }

  return { message: 'Unknown error' };
}

export function toValidationError(err) {
  return { message: err.msg };
}

export function toValidationErrorMessage(path, message) {
  return `${message}: ${path}`;
}
