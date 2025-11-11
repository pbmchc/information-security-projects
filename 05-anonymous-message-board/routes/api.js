import mongoose from 'mongoose';

import * as threadController from '../controllers/threadController.js';
import {
  createThreadValidationChain,
  createThreadReplyValidationChain,
} from '../validators/threadValidator.js';

mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB);

export const setupRoutes = (app) => {
  app
    .route('/api/threads/:board')
    .get(threadController.getRelatedThreads)
    .post(createThreadValidationChain(), threadController.createThread)
    .put(threadController.reportThread)
    .delete(threadController.deleteThread);

  app
    .route('/api/replies/:board')
    .get(threadController.getSingleThread)
    .post(createThreadReplyValidationChain(), threadController.createThreadReply)
    .put(threadController.reportThreadReply)
    .delete(threadController.deleteThreadReply);
};
