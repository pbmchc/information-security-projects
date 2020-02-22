'use strict';

const Issue = require('../models/issue');

const FETCHING_ISSUES_ERROR_MESSAGE = 'Error while fetching issues';
const SAVING_ISSUE_ERROR_MESSAGE = 'Error while saving issue';
const DELETING_ISSUE_ERROR_MESSAGE = (id) => `Could not delete ${id}`
const DELETING_ISSUE_SUCCESS_MESSAGE = (id) => `Deleted ${id}`

function createIssue(issue, done) {
    const newIssue = new Issue(issue);

    newIssue.save((err, result) => {
        if(err) {
            return done({ msg: SAVING_ISSUE_ERROR_MESSAGE });
        }

        done(null, result);
    });
}

function deleteIssue(issue, done) {
    const {_id} = issue;

    Issue.remove(issue, (err) =>
        err
            ? done({msg: DELETING_ISSUE_ERROR_MESSAGE(_id)})
            : done(null, DELETING_ISSUE_SUCCESS_MESSAGE(_id)));
}

function getIssues(params, done) {
    const query = Issue.find(params);

    query.exec((err, result) => {
        if (err) {
            return done({msg: FETCHING_ISSUES_ERROR_MESSAGE});
        }

        done(null, result);
    })
}

exports.createIssue = createIssue;
exports.deleteIssue = deleteIssue;
exports.getIssues = getIssues;