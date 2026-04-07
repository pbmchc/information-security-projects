import * as bookController from '../controllers/bookController.js';
import {
  createBookValidationChain,
  createBookCommentsValidationChain,
} from '../validators/bookValidator.js';

export const setupRoutes = (app) => {
  app
    .route('/api/books')
    .get(bookController.getBooks)
    .post(createBookValidationChain(), bookController.addBook)
    .delete(bookController.deleteBooks);

  app
    .route('/api/books/:id')
    .get(bookController.getSingleBook)
    .post(createBookCommentsValidationChain(), bookController.updateBookComments)
    .delete(bookController.deleteBook);
};
