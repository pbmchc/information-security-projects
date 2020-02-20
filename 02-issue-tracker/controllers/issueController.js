'use strict';

const issueRepository = require('../repositories/issueRepository');
const {prepareErrorPayload} = require('../helpers/errorHelper');
const {validationResult} = require('express-validator');

function createIssue(req, res, next) {
    const {errors: [err]} = validationResult(req);

    if(err) {
        return next(prepareErrorPayload(err.msg));
    }

    const {body, params: {project}} = req;
    const issue = {...body, project};

    issueRepository.createIssue(issue, (err, result) => {
        if(err) {
            return next(prepareErrorPayload(err.msg));
        }

        res.json(result);
    });
}

exports.createIssue = createIssue;