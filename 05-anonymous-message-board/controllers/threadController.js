'use strict';

const {validationResult} = require('express-validator');
const {encrypt} = require('../helpers/encryptHelper');
const {prepareErrorPayload} = require('../helpers/errorHelper');
const threadRepository = require('../repositories/threadRepository');

const DEFAULT_SUCCESS_MESSAGE = 'success';

async function createThread(req, res, next) {
    const {body, params: {board}} = req;
    const {errors: [err]} = validationResult(req);

    if(err) {
        return next(prepareErrorPayload(err.msg));
    }

    try {
        const thread = await _buildThread(body, board);

        await threadRepository.createThread(thread);

        res.redirect(`/b/${board}`);
    } catch(err) {
        next(prepareErrorPayload(err.msg));
    }
}

async function getSingleThread(req, res, next) {
    const {query: {thread_id}} = req;

    try {
        res.json(await threadRepository.getSingleThread(thread_id));
    } catch(err) {
        next(prepareErrorPayload(err.msg));
    }
}

async function getRelatedThreads(req, res, next) {
    const {params: {board}} = req;

    try {
        res.json(await threadRepository.getRelatedThreads(board));
    } catch(err) {
        next(prepareErrorPayload(err.msg));
    }
}

async function reportThread(req, res, next) {
    const {body: {report_id}} = req;

    try {
        await threadRepository.reportThread(report_id);
        res.send(DEFAULT_SUCCESS_MESSAGE);
    } catch(err) {
        next(prepareErrorPayload(err.msg));
    }
}

async function deleteThread(req, res, next) {
    const {body} = req;

    try {
        await threadRepository.deleteThread(body);
        res.send(DEFAULT_SUCCESS_MESSAGE);
    } catch(err) {
        next(prepareErrorPayload(err.msg));
    }
}

async function createThreadReply(req, res, next) {
    const {body: {text, delete_password, thread_id}, params: {board}} = req;
    const {errors: [err]} = validationResult(req);

    if(err) {
        return next(prepareErrorPayload(err.msg));
    }

    try {
        const reply = await _buildReply({text, delete_password});

        await threadRepository.createThreadReply(reply, thread_id);

        res.redirect(`/b/${board}/${thread_id}`);
    } catch(err) {
        next(prepareErrorPayload(err.msg));
    }
}

async function reportThreadReply(req, res, next) {
    const {body} = req;

    try {
        await threadRepository.reportThreadReply(body);
        res.send(DEFAULT_SUCCESS_MESSAGE);
    } catch(err) {
        next(prepareErrorPayload(err.msg));
    }
}

async function deleteThreadReply(req, res, next) {
    const {body} = req;

    try {
        await threadRepository.deleteThreadReply(body);
        res.send(DEFAULT_SUCCESS_MESSAGE);
    } catch(err) {
        next(prepareErrorPayload(err.msg));
    }
}

async function _buildReply(reply) {
    return {
        ...reply,
        delete_password: await _encryptDeletePassword(reply)
    };
}

async function _buildThread(thread, board) {
    return {
        ...thread,
        delete_password: await _encryptDeletePassword(thread),
        board
    };
}

function _encryptDeletePassword({delete_password}) {
    return encrypt(delete_password);
}

exports.createThread = createThread;
exports.getSingleThread = getSingleThread;
exports.getRelatedThreads = getRelatedThreads;
exports.reportThread = reportThread;
exports.deleteThread = deleteThread;
exports.createThreadReply = createThreadReply;
exports.reportThreadReply = reportThreadReply;
exports.deleteThreadReply = deleteThreadReply;