'use strict';

const Issue = require('../models/issue');
const {assignDateConditions} = require('../utils/validatorUtils');

const ISSUE_DATE_FIELDS = ['created_on', 'updated_on'];
const FETCHING_ISSUES_ERROR_MESSAGE = 'Error while fetching issues';
const SAVING_ISSUE_ERROR_MESSAGE = 'Error while saving issue';
const UPDATING_ISSUE_ERROR_MESSAGE = (id) => `Could not update ${id}`;
const UPDATING_ISSUE_SUCCESS_MESSAGE = (id) => `Successfully updated ${id}`;
const DELETING_ISSUE_ERROR_MESSAGE = (id) => `Could not delete ${id}`;
const DELETING_ISSUE_SUCCESS_MESSAGE = (id) => `Deleted ${id}`;

function createIssue(issue, done) {
    const newIssue = new Issue(issue);

    newIssue.save((err, result) => {
        if(err) {
            return done({ msg: SAVING_ISSUE_ERROR_MESSAGE });
        }

        done(null, result);
    });
}

function updateIssue(issue, done) {
    const {_id} = issue;
    const updatedIssue = {...issue, updated_on: Date.now()};

    Issue.update({_id}, updatedIssue, (err) =>
        err
            ? done({msg: UPDATING_ISSUE_ERROR_MESSAGE(_id)})
            : done(null, UPDATING_ISSUE_SUCCESS_MESSAGE(_id)));
}

function deleteIssue(issue, done) {
    const {_id} = issue;

    Issue.remove(issue, (err) =>
        err
            ? done({msg: DELETING_ISSUE_ERROR_MESSAGE(_id)})
            : done(null, DELETING_ISSUE_SUCCESS_MESSAGE(_id)));
}

function getIssues(conditions, done) {
    ISSUE_DATE_FIELDS.forEach(field => assignDateConditions(field, conditions));

    const query = Issue.find(conditions);

    query.exec((err, result) => {
        if (err) {
            return done({msg: FETCHING_ISSUES_ERROR_MESSAGE});
        }

        done(null, result);
    })
}

exports.createIssue = createIssue;
exports.updateIssue = updateIssue;
exports.deleteIssue = deleteIssue;
exports.getIssues = getIssues;