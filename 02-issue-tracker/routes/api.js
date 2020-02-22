'use strict';

var expect = require('chai').expect;
const mongoose = require('mongoose');

const issueController = require('../controllers/issueController');
const {createIssueValidator} = require('../validators/issueValidator');

mongoose.connect(
  process.env.DB,
  {
    useNewUrlParser: true,
    useCreateIndex: true
  }
);

module.exports = function (app) {

  app.route('/api/issues/:project')
    .get(issueController.getIssues)
    .post(createIssueValidator, issueController.createIssue)
    
    .put(function (req, res){
      var project = req.params.project;
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });
    
};
