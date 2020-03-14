'use strict';

const Thread = require('../models/thread');
const {compare} = require('../helpers/encryptHelper');

const CREATING_THREAD_ERROR_MESSAGE = 'Error while creating thread';
const CREATING_THREAD_REPLY_ERROR_MESSAGE = 'Error while saving reply';
const FETCHING_THREAD_ERROR_MESSAGE = (id) => `Error while fetching thread ${id}`;
const DELETING_THREAD_ERROR_MESSAGE = 'Error while deleting thread';
const INCORRECT_PASSWORD_ERROR_MESSAGE = 'Incorrect password';

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

async function deleteThread({delete_password, thread_id}) {
    try {
        const thread = await Thread.findById(thread_id).lean();

        return await compare(delete_password, thread.delete_password)
            ? Thread.findByIdAndDelete(thread_id)
            : Promise.reject({msg: INCORRECT_PASSWORD_ERROR_MESSAGE});

    } catch(err) {
        return Promise.reject({msg: DELETING_THREAD_ERROR_MESSAGE});
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
exports.deleteThread = deleteThread;
exports.createThreadReply = createThreadReply;