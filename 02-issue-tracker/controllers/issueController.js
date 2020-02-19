'use strict';

const issueRepository = require('../repositories/issueRepository');

function addIssue({body, params: {project}}, res, next) {
    const issue = {...body, project};

    issueRepository.createIssue(issue, (err, result) => {
        res.json(result);
    });
}

exports.addIssue = addIssue;