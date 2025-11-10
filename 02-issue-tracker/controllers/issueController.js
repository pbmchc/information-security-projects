import { validationResult } from 'express-validator';

import * as issueRepository from '../repositories/issueRepository.js';
import { toHttpError, toValidationError } from '../utils/errorUtils.js';

export async function createIssue(req, res, next) {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    return next({ errors: errors.map((err) => toValidationError(err)) });
  }

  try {
    const {
      body,
      params: { project },
    } = req;
    const result = await issueRepository.createIssue({ ...body, project });

    return res.json(result);
  } catch (err) {
    return next(toHttpError(err));
  }
}

export async function updateIssue(req, res, next) {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    return next({ errors: errors.map((err) => toValidationError(err)) });
  }

  try {
    const { body } = req;
    const result = await issueRepository.updateIssue(body);

    return res.send(result);
  } catch {
    return next(toHttpError(err));
  }
}

export async function deleteIssue(req, res, next) {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    return next({ errors: errors.map((err) => toValidationError(err)) });
  }

  try {
    const { body } = req;
    const result = await issueRepository.deleteIssue(body);

    return res.send(result);
  } catch {
    return next(toHttpError(err));
  }
}

export async function getIssues(req, res, next) {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    return next({ errors: errors.map((err) => toValidationError(err)) });
  }

  try {
    const { params, query } = req;
    const conditions = { ...params, ...query };
    const result = await issueRepository.getIssues(conditions);

    return res.json(result);
  } catch {
    return next(toHttpError(err));
  }
}
