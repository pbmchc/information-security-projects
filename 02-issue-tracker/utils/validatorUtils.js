const {getTomorrowDate} = require('./dateUtils');

const ID_KEY = '_id';

const isFieldEmpty = (value) => value === null || value === undefined || value === '';
const hasFieldValues = (issue) => Object.keys(issue).filter(key => key !== ID_KEY && !isFieldEmpty(issue[key])).length > 0;
const assignDateConditions = (field, conditions) => {
    const value = conditions[field];

    if(!value) {
        return;
    }

    const startDate = new Date(value);
    const endDate = getTomorrowDate(startDate);

    Object.assign(conditions, {[field]: {$gt: startDate, $lt: endDate}});
};

exports.hasFieldValues = hasFieldValues;
exports.assignDateConditions = assignDateConditions;