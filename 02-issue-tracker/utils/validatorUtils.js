const ID_KEY = '_id';

const isFieldEmpty = (value) => value === null || value === undefined || value === '';
const hasFieldValues = (issue) => Object.keys(issue).filter(key => key !== ID_KEY && !isFieldEmpty(issue[key])).length > 0;

exports.hasFieldValues = hasFieldValues;