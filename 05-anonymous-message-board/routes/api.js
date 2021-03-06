'use strict';

const mongoose = require('mongoose');

const threadController = require('../controllers/threadController');
const {threadValidator, threadReplyValidator} = require('../validators/validators');

mongoose.connect(
  process.env.DB,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);

module.exports = function (app) {
  app.route('/api/threads/:board')
    .get(threadController.getRelatedThreads)
    .post(threadValidator, threadController.createThread)
    .put(threadController.reportThread)
    .delete(threadController.deleteThread);
  app.route('/api/replies/:board')
    .get(threadController.getSingleThread)
    .post(threadReplyValidator, threadController.createThreadReply)
    .put(threadController.reportThreadReply)
    .delete(threadController.deleteThreadReply);
};
