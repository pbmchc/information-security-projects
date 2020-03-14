'use strict';

const mongoose = require('mongoose');

const threadController = require('../controllers/threadController');

mongoose.connect(
  process.env.DB,
  {
    useNewUrlParser: true,
    useCreateIndex: true
  }
);

module.exports = function (app) {
  app.route('/api/threads/:board')
    .post(threadController.createThread);
  app.route('/api/replies/:board')
    .get(threadController.getSingleThread)
    .post(threadController.createThreadReply);
};
