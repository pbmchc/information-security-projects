'use strict';

const mongoose = require('mongoose');

const threadController = require('../controllers/threadController');

mongoose.connect(
  process.env.DB,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);

module.exports = function (app) {
  app.route('/api/threads/:board')
    .post(threadController.createThread)
    .delete(threadController.deleteThread);
  app.route('/api/replies/:board')
    .get(threadController.getSingleThread)
    .post(threadController.createThreadReply)
    .delete(threadController.deleteThreadReply);
};
