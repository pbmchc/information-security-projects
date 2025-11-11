import mongoose from 'mongoose';

import { ReplySchema } from './reply.js';

const Schema = mongoose.Schema;
const ThreadSchema = new Schema({
  board: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  delete_password: {
    type: String,
    required: true,
  },
  replies: {
    type: [ReplySchema],
    default: [],
  },
  reported: {
    type: Boolean,
    default: false,
  },
  created_on: {
    type: Date,
    default: Date.now(),
  },
  bumped_on: {
    type: Date,
    default: Date.now(),
  },
});
export const Thread = mongoose.model('Thread', ThreadSchema);
