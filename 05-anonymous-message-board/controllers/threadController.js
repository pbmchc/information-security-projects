'use strict';

const threadRepository = require('../repositories/threadRepository');
const {prepareErrorPayload} = require('../helpers/errorHelper');
const {encrypt} = require('../helpers/encryptHelper');

async function createThread(req, res, next) {
    const {body, params: {board}} = req;

    try {
        const thread = await _buildThread(body, board);

        await threadRepository.createThread(thread);

        res.redirect(`/b/${board}`);
    } catch(err) {
        next(prepareErrorPayload(err.msg));
    }
}

async function _buildThread(thread, board) {
    return {
        ...thread,
        delete_password: await _encryptThreadPassword(thread),
        board
    };
}

function _encryptThreadPassword({delete_password}) {
    return encrypt(delete_password);
}

exports.createThread = createThread;