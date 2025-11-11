import { Thread } from '../models/thread.js';
import { compare } from '../utils/encryptUtils.js';
import { CustomError, CUSTOM_ERROR_TYPES } from '../utils/errorUtils.js';

const THREAD_CREATE_ERROR = 'Error while creating thread';
const THREAD_DELETE_ERROR = 'Error while deleting thread';
const THREAD_GET_ERROR = (id) => `Error while fetching thread ${id}`;
const THREAD_INCORRECT_PASSWORD_ERROR = 'Incorrect password';
const THREAD_REPORT_ERROR = 'Error while reporting thread';
const THREAD_REPLY_CREATE_ERROR = 'Error while saving reply';
const THREAD_REPLY_DELETE_ERROR = 'Error while deleting thread reply';
const THREAD_REPLY_DELETED_TEXT = '[deleted]';
const THREAD_REPLY_REPORT_ERROR = 'Error while reporting thread reply';
const THREADS_GET_CONFIG = { LIMIT: 10, SORT: { bumped_on: 'desc' } };
const THREADS_REPLY_GET_CONFIG = { LIMIT: 3 };
const THREADS_GET_ERROR = 'Error while fetching threads';

function getExcludedFieldsSelectors(...fields) {
  return fields.reduce(
    (selectors, field) => ({
      ...selectors,
      [field]: 0,
      [`replies.${field}`]: 0,
    }),
    {}
  );
}

function sortReplies({ replies, ...thread }) {
  return {
    ...thread,
    replies: replies.sort((replyA, replyB) => replyB.created_on - replyA.created_on),
  };
}

export async function getSingleThread(id) {
  try {
    const thread = await Thread.findById(id)
      .select({ board: 0, ...getExcludedFieldsSelectors('delete_password', 'reported') })
      .lean();
    return sortReplies(thread);
  } catch {
    throw new CustomError(THREAD_GET_ERROR);
  }
}

export async function createThread(input) {
  const thread = new Thread(input);

  try {
    return thread.save();
  } catch {
    throw new CustomError(THREAD_CREATE_ERROR);
  }
}

export async function reportThread(id) {
  try {
    return await Thread.findByIdAndUpdate(id, { reported: true });
  } catch {
    throw new CustomError(THREAD_REPORT_ERROR);
  }
}

export async function deleteThread({ delete_password, thread_id }) {
  try {
    const thread = await Thread.findById(thread_id).lean();
    const canDeleteThread = await compare(delete_password, thread.delete_password);

    if (!canDeleteThread) {
      throw new CustomError(THREAD_INCORRECT_PASSWORD_ERROR, CUSTOM_ERROR_TYPES.FORBIDDEN);
    }

    return await Thread.findByIdAndDelete(thread_id);
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError(THREAD_DELETE_ERROR);
  }
}

export async function createThreadReply(reply, id) {
  const update = { bumped_on: Date.now(), $push: { replies: reply } };

  try {
    return await Thread.findByIdAndUpdate(id, update, { new: true });
  } catch {
    throw new CustomError(THREAD_REPLY_CREATE_ERROR);
  }
}

export async function reportThreadReply({ reply_id, thread_id }) {
  try {
    const thread = await Thread.findById(thread_id);
    const reply = thread.replies.id(reply_id);

    reply.set({ reported: true });
    return thread.save();
  } catch {
    throw new CustomError(THREAD_REPLY_REPORT_ERROR);
  }
}

export async function deleteThreadReply({ delete_password, reply_id, thread_id }) {
  try {
    const thread = await Thread.findById(thread_id);
    const reply = thread.replies.id(reply_id);
    const canDeleteThreadReply = await compare(delete_password, reply.delete_password);

    if (!canDeleteThreadReply) {
      throw new CustomError(THREAD_INCORRECT_PASSWORD_ERROR, CUSTOM_ERROR_TYPES.FORBIDDEN);
    }

    reply.set({ text: THREAD_REPLY_DELETED_TEXT });
    return thread.save();
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError(THREAD_REPLY_DELETE_ERROR);
  }
}

function toRelatedThreadDetails(thread) {
  const { replies, ...details } = sortReplies(thread);

  return {
    ...details,
    replycount: replies.length,
    replies: replies.slice(0, THREADS_REPLY_GET_CONFIG.LIMIT),
  };
}

export async function getRelatedThreads(board) {
  try {
    const threads = await Thread.find({ board })
      .sort(THREADS_GET_CONFIG.SORT)
      .limit(THREADS_GET_CONFIG.LIMIT)
      .lean();

    return threads.map(toRelatedThreadDetails);
  } catch (err) {
    return Promise.reject({ msg: THREADS_GET_ERROR });
  }
}
