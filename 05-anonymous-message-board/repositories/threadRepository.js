'use strict';

const Thread = require('../models/thread');

const CREATING_THREAD_ERROR_MESSAGE = 'Error while creating thread';

async function createThread(data) {
    const thread = new Thread(data);

    try {
        return thread.save();
    } catch(err) {
        return Promise.reject({msg: CREATING_THREAD_ERROR_MESSAGE});
    }
}

exports.createThread = createThread;