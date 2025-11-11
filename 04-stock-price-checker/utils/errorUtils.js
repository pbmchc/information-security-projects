import { HTTP_ERROR_CODES } from '../constants/httpErrorCodes.js';

export class CustomError extends Error {
  constructor(message, type) {
    super(message);
    this.name = 'CustomError';
    this.type = type;
  }
}

export function toHttpError(err) {
  if (err instanceof CustomError) {
    return { message: err.message, status: HTTP_ERROR_CODES.INTERNAL_SERVER_ERROR };
  }

  return { message: 'Unknown error' };
}
