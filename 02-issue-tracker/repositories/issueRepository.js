'use strict';

const Issue = require('../models/issue');

const SAVING_ISSUE_ERROR_MESSAGE = 'Error while saving issue';

function createIssue(issue, done) {
    const newIssue = new Issue(issue);

    newIssue.save((err, result) => {
        if(err) {
            return done({ msg: SAVING_ISSUE_ERROR_MESSAGE });
        }

        done(null, result);
    });
}

exports.createIssue = createIssue;