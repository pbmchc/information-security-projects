'use strict';

const threadRepository = require('../repositories/threadRepository');
const {prepareErrorPayload} = require('../helpers/errorHelper');

async function createThread(req, res, next) {
    const {body, params: {board}} = req;

    try {
        const thread = {...body, board};

        await threadRepository.createThread(thread);

        res.redirect(`/b/${board}`);
    } catch(err) {
        next(prepareErrorPayload(err));
    }
}

exports.createThread = createThread;