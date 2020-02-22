'use strict';

var expect = require('chai').expect;
const mongoose = require('mongoose');

const issueController = require('../controllers/issueController');
const issueParamsValidator = require('../validators/issueParamsValidator');
const {createIssueValidator, updateIssueValidator, deleteIssueValidator} = require('../validators/issueValidator');

mongoose.connect(
  process.env.DB,
  {
    useNewUrlParser: true,
    useCreateIndex: true
  }
);

module.exports = function (app) {
  app.route('/api/issues/:project')
    .get(issueParamsValidator, issueController.getIssues)
    .post(createIssueValidator, issueController.createIssue)
    .put(updateIssueValidator, issueController.updateIssue)
    .delete(deleteIssueValidator, issueController.deleteIssue);
};
