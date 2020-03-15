'use strict';

const mongoose = require('mongoose');

const replySchema = require('./reply');

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
    reported: {
        type: Boolean,
        default: false
    },
    created_on: {
        type: Date,
        default: Date.now()
    },
    bumped_on: {
        type: Date,
        default: Date.now()
    },
    replies: {
        type: [replySchema],
        default: []
    }
});
const Thread = mongoose.model('Thread', threadSchema);

module.exports = Thread;