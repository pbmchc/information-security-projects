'use strict';

const Thread = require('../models/thread');
const {compare} = require('../helpers/encryptHelper');

const DELETED_THREAD_REPLY_TEXT = '[deleted]';
const CREATING_THREAD_ERROR_MESSAGE = 'Error while creating thread';
const CREATING_THREAD_REPLY_ERROR_MESSAGE = 'Error while saving reply';
const FETCHING_THREAD_ERROR_MESSAGE = (id) => `Error while fetching thread ${id}`;
const FETCHING_THREADS_ERROR_MESSAGE = 'Error while fetching threads';
const DELETING_THREAD_ERROR_MESSAGE = 'Error while deleting thread';
const DELETING_THREAD_REPLY_ERROR_MESSAGE = 'Error while deleting thread reply';
const REPORTING_THREAD_ERROR_MESSAGE = 'Error while reporting thread';
const REPORTING_THREAD_REPLY_ERROR_MESSAGE = 'Error while reporting thread reply';
const INCORRECT_PASSWORD_ERROR_MESSAGE = 'Incorrect password';
const THREAD_FETCH_CONFIG = {LIMIT: 10, SORT: {bumped_on: 'desc'}};
const THREAD_REPLY_FETCH_CONFIG = {LIMIT: 3};
const THREAD_EXCLUDED_FIELDS = {
    board: 0,
    ..._getExcludedCommonFieldsSelectors(
        'delete_password',
        'reported'
    )
};

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
        return await Thread.findById(id).select(THREAD_EXCLUDED_FIELDS).lean();
    } catch(err) {
        return Promise.reject({msg: FETCHING_THREAD_ERROR_MESSAGE(id)});
    }
}

async function getRelatedThreads(board) {
    try {
        const threads = await Thread
            .find({board})
            .sort(THREAD_FETCH_CONFIG.SORT)
            .limit(THREAD_FETCH_CONFIG.LIMIT)
            .lean();
        
        return threads.map(_mapToRelatedThreadDetails);
    } catch(err) {
        return Promise.reject({msg: FETCHING_THREADS_ERROR_MESSAGE});
    }
}

async function reportThread(id) {
    try {
        return Thread.findByIdAndUpdate(id, {reported: true});
    } catch(err) {
        return Promise.reject({msg: REPORTING_THREAD_ERROR_MESSAGE});
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

async function reportThreadReply({reply_id, thread_id}) {
    try {
        const thread = await Thread.findById(thread_id);
        const reply = thread.replies.id(reply_id);
        
        reply.set({reported: true});

        return thread.save();
    } catch(err) {
        return Promise.reject({msg: REPORTING_THREAD_REPLY_ERROR_MESSAGE});
    }
}

async function deleteThreadReply({delete_password, reply_id, thread_id}) {
    try {
        const thread = await Thread.findById(thread_id);
        const reply = thread.replies.id(reply_id);
        const passwordMatch = await compare(delete_password, reply.delete_password);

        if(passwordMatch) {
            reply.set({text: DELETED_THREAD_REPLY_TEXT});

            return thread.save();
        }

        return Promise.reject({msg: INCORRECT_PASSWORD_ERROR_MESSAGE});
    } catch(err) {
        return Promise.reject({msg: DELETING_THREAD_REPLY_ERROR_MESSAGE});
    }
}

function _mapToRelatedThreadDetails({replies, ...thread}) {
    return {
        ...thread,
        replycount: replies.length,
        replies: replies
            .sort((replyA, replyB) => replyB.created_on - replyA.created_on)
            .slice(0, THREAD_REPLY_FETCH_CONFIG.LIMIT)
    };
}

function _getExcludedCommonFieldsSelectors(...fields) {
    return fields.reduce((selectors, field) => ({
        ...selectors,
        [field]: 0,
        [`replies.${field}`]: 0
    }), {});
}

exports.createThread = createThread;
exports.getSingleThread = getSingleThread;
exports.getRelatedThreads = getRelatedThreads;
exports.reportThread = reportThread;
exports.deleteThread = deleteThread;
exports.createThreadReply = createThreadReply;
exports.reportThreadReply = reportThreadReply;
exports.deleteThreadReply = deleteThreadReply;