import { validationResult } from 'express-validator';

import * as threadRepository from '../repositories/threadRepository.js';
import { encrypt } from '../utils/encryptUtils.js';
import { toHttpError, toValidationError } from '../utils/errorUtils.js';

const REQUEST_SUCCESS = 'Success';

export async function getSingleThread(req, res, next) {
  try {
    const {
      query: { thread_id },
    } = req;
    const result = await threadRepository.getSingleThread(thread_id);

    return res.json(result);
  } catch (err) {
    return next(toHttpError(err));
  }
}

export async function createThread(req, res, next) {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    return next({ errors: errors.map((err) => toValidationError(err)) });
  }

  try {
    const {
      body,
      params: { board },
    } = req;
    const { delete_password } = body;
    const encryptedDeletePassword = await encrypt(delete_password);
    const thread = { ...body, board, delete_password: encryptedDeletePassword };

    await threadRepository.createThread(thread);

    return res.redirect(`/b/${board}`);
  } catch (err) {
    return next(toHttpError(err));
  }
}

export async function reportThread(req, res, next) {
  try {
    const {
      body: { report_id },
    } = req;

    await threadRepository.reportThread(report_id);
    return res.send(REQUEST_SUCCESS);
  } catch (err) {
    return next(toHttpError(err));
  }
}

export async function deleteThread(req, res, next) {
  try {
    const { body } = req;

    await threadRepository.deleteThread(body);
    return res.send(REQUEST_SUCCESS);
  } catch (err) {
    return next(toHttpError(err));
  }
}

export async function createThreadReply(req, res, next) {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    return next({ errors: errors.map((err) => toValidationError(err)) });
  }

  try {
    const {
      body: { text, delete_password, thread_id },
      params: { board },
    } = req;
    const encryptedDeletePassword = await encrypt(delete_password);
    const reply = { text, delete_password: encryptedDeletePassword };

    await threadRepository.createThreadReply(reply, thread_id);

    return res.redirect(`/b/${board}/${thread_id}`);
  } catch (err) {
    return next(toHttpError(err));
  }
}

export async function reportThreadReply(req, res, next) {
  try {
    const { body } = req;

    await threadRepository.reportThreadReply(body);
    return res.send(REQUEST_SUCCESS);
  } catch (err) {
    return next(toHttpError(err));
  }
}

export async function deleteThreadReply(req, res, next) {
  try {
    const { body } = req;

    await threadRepository.deleteThreadReply(body);
    return res.send(REQUEST_SUCCESS);
  } catch (err) {
    return next(toHttpError(err));
  }
}

export async function getRelatedThreads(req, res, next) {
  try {
    const {
      params: { board },
    } = req;
    const result = await threadRepository.getRelatedThreads(board);

    return res.json(result);
  } catch (err) {
    return next(toHttpError(err));
  }
}
