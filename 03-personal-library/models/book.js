import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  comments: {
    type: [String],
    default: [],
  },
});
export const Book = mongoose.model('Book', BookSchema);
