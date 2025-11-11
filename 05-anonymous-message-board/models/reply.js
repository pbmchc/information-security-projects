import mongoose from 'mongoose';

const Schema = mongoose.Schema;
export const ReplySchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  delete_password: {
    type: String,
    required: true,
  },
  reported: {
    type: Boolean,
    default: false,
  },
  created_on: {
    type: Date,
    default: Date.now(),
  },
});
