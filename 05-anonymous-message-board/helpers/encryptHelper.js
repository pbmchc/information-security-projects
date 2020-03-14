'use strict';

const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

function encrypt(data) {
    return bcrypt.hash(data, SALT_ROUNDS);
}

function compare(data, encrypted) {
    return bcrypt.compare(data, encrypted);
}

exports.encrypt = encrypt;
exports.compare = compare;
