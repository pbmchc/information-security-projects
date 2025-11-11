import { Book } from '../models/book.js';
import { CustomError, CUSTOM_ERROR_TYPES } from '../utils/errorUtils.js';

const BOOK_DELETE_ERROR = 'Error while deleting book';
const BOOK_DELETE_SUCCESS = 'Delete successful';
const BOOK_GET_BY_ID_ERROR = 'Error while fetching book';
const BOOK_NOT_FOUND_ERROR = 'No book exists';
const BOOK_SAVE_ERROR = 'Error while saving book';
const BOOK_UPDATE_COMMENTS_ERROR = 'Error while updating comments';
const BOOKS_DELETE_ERROR = 'Error while deleting books';
const BOOKS_DELETE_SUCCESS = 'Complete delete successful';
const BOOKS_GET_ERROR = 'Error while fetching books';

function toSingleBook({ _id, title, comments }) {
  return { _id, title, comments };
}

export async function getBookById(id) {
  try {
    const result = await Book.findById(id);
    if (!result) {
      throw new CustomError(BOOK_NOT_FOUND_ERROR, CUSTOM_ERROR_TYPES.NOT_FOUND);
    }

    return toSingleBook(result);
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError(BOOK_GET_BY_ID_ERROR);
  }
}

export async function createBook(input) {
  const book = new Book(input);

  try {
    const result = await book.save();
    return toSingleBook(result);
  } catch {
    throw new CustomError(BOOK_SAVE_ERROR);
  }
}

export async function updateBookComments({ id }, { comment }) {
  try {
    const result = await Book.findByIdAndUpdate(
      id,
      { $push: { comments: comment } },
      { new: true }
    );
    return toSingleBook(result);
  } catch (err) {
    throw new CustomError(BOOK_UPDATE_COMMENTS_ERROR);
  }
}

export async function deleteBook({ id }) {
  try {
    await Book.deleteOne({ _id: id });
    return BOOK_DELETE_SUCCESS;
  } catch (err) {
    throw new CustomError(BOOK_DELETE_ERROR);
  }
}

export async function getBooks() {
  try {
    const results = await Book.find({});
    return results.map(({ _id, title, comments }) => ({
      _id,
      title,
      commentcount: comments.length,
    }));
  } catch {
    throw new CustomError(BOOKS_GET_ERROR);
  }
}

export async function deleteBooks() {
  try {
    await Book.deleteMany({});
    return BOOKS_DELETE_SUCCESS;
  } catch {
    throw new CustomError(BOOKS_DELETE_ERROR);
  }
}
