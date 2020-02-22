'use strict';

const Issue = require('../models/issue');

const SAVING_ISSUE_ERROR_MESSAGE = 'Error while saving issue';
const FETCHING_ISSUES_ERROR_MESSAGE = 'Error while fetching issues';

function createIssue(issue, done) {
    const newIssue = new Issue(issue);

    newIssue.save((err, result) => {
        if(err) {
            return done({ msg: SAVING_ISSUE_ERROR_MESSAGE });
        }

        done(null, result);
    });
}

function getIssues(params, done) {
    const query = Issue.find(params);

    query.exec((err, result) => {
        if (err) {
            return done({ msg: FETCHING_ISSUES_ERROR_MESSAGE });
        }

        done(null, result);
    })
}

exports.createIssue = createIssue;
exports.getIssues = getIssues;