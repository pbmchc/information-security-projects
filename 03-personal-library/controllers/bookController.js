import { validationResult } from 'express-validator';

import * as bookRepository from '../repositories/bookRepository.js';
import { toHttpError, toValidationError } from '../utils/errorUtils.js';

export async function getSingleBook({ params }, res, next) {
  try {
    const { id } = params;
    const result = await bookRepository.getBookById(id);

    return res.json(result);
  } catch (err) {
    return next(toHttpError(err));
  }
}

export async function addBook(req, res, next) {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    return next({ errors: errors.map((err) => toValidationError(err)) });
  }

  try {
    const { body } = req;
    const result = await bookRepository.createBook(body);

    return res.json(result);
  } catch (err) {
    return next(toHttpError(err));
  }
}

export async function updateBookComments(req, res, next) {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    return next({ errors: errors.map((err) => toValidationError(err)) });
  }

  try {
    const { body, params } = req;
    const result = await bookRepository.updateBookComments(params, body);

    return res.json(result);
  } catch (err) {
    return next(toHttpError(err));
  }
}

export async function deleteBook({ params }, res, next) {
  try {
    const result = await bookRepository.deleteBook(params);
    return res.send(result);
  } catch (err) {
    return next(toHttpError(err));
  }
}

export async function getBooks(_req, res, next) {
  try {
    const result = await bookRepository.getBooks();
    return res.json(result);
  } catch (err) {
    return next(toHttpError(err));
  }
}

export async function deleteBooks(_req, res, next) {
  try {
    const result = await bookRepository.deleteBooks();
    return res.send(result);
  } catch (err) {
    return next(toHttpError(err));
  }
}
