'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const threadSchema = new Schema({
    board: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    delete_password: {
        type: String,
        required: true
    },
    reported: Boolean,
    created_on: {
        type: Date,
        default: Date.now()
    },
    bumped_on: {
        type: Date,
        default: Date.now()
    },
    replies: {
        type: [String],
        default: []
    }
});
const Thread = mongoose.model('Thread', threadSchema);

module.exports = Thread;