'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const replySchema = new Schema({
    text: {
        type: String,
        required: true
    },
    delete_password: {
        type: String,
        required: true
    },
    created_on: {
        type: Date,
        default: Date.now()
    },
    reported: Boolean
});

module.exports = replySchema;