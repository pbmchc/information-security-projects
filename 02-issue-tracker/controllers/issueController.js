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

function deleteIssue(req, res, next) {
    const {errors: [err]} = validationResult(req);

    if(err) {
        return next(prepareErrorPayload(err.msg));
    }

    const {body} = req;

    issueRepository.deleteIssue(body, (err, result) => {
        if(err) {
            return next(prepareErrorPayload(err.msg));
        }

        res.send(result);
    });
}

function getIssues(req, res, next) {
    const {params} = req;

    issueRepository.getIssues(params, (err, result) => {
        if (err) {
            return next(errorHandler.prepareErrorPayload(err.msg));
        }

        res.json(result);
    });
}

exports.createIssue = createIssue;
exports.deleteIssue = deleteIssue;
exports.getIssues = getIssues;