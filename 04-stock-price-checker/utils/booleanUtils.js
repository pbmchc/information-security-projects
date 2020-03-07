function parseStringifiedBoolean(value) {
    return value === 'false' ? false : Boolean(value);
}

exports.parseStringifiedBoolean = parseStringifiedBoolean;