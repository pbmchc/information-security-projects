'use strict';

const Thread = require('../models/thread');

const CREATING_THREAD_ERROR_MESSAGE = 'Error while creating thread';
const CREATING_THREAD_REPLY_ERROR_MESSAGE = 'Error while saving reply';
const FETCHING_THREAD_ERROR_MESSAGE = (id) => `Error while fetching thread ${id}`;

async function createThread(data) {
    const thread = new Thread(data);

    try {
        return thread.save();
    } catch(err) {
        return Promise.reject({msg: CREATING_THREAD_ERROR_MESSAGE});
    }
}

async function getSingleThread(id) {
    try {
        const {delete_password, reported, ...thread} = await Thread.findById(id).lean();

        return thread;
    } catch(err) {
        return Promise.reject({msg: FETCHING_THREAD_ERROR_MESSAGE(id)});
    }
}

async function createThreadReply(reply, id) {
    const update = {bumped_on: Date.now(), $push: {replies: reply}};

    try {
        return Thread.findByIdAndUpdate(id, update);
    } catch(err) {
        return Promise.reject({msg: CREATING_THREAD_REPLY_ERROR_MESSAGE});
    }
}

exports.createThread = createThread;
exports.getSingleThread = getSingleThread;
exports.createThreadReply = createThreadReply;