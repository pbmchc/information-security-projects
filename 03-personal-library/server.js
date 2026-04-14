import 'dotenv/config';

import express from 'express';
import nocache from 'nocache';

import { HTTP_ERROR_CODES } from './constants/httpErrorCodes.js';
import { connectToDatabase } from './database/connection.js';
import hat from './middlewares/hat.js';
import { setupRoutes } from './routes/api.js';

const ENV = process.env.NODE_ENV || 'development';
const IS_TEST = ENV === 'test';
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(hat.fakePoweredBy('PHP 4.2.0'));
app.use(nocache());

app.use('/static', express.static('public'));

app.route('/').get((_, res) => {
  res.sendFile('views/index.html', { root: import.meta.dirname });
});

setupRoutes(app);

app.use((_req, res, _next) => {
  res.status(HTTP_ERROR_CODES.NOT_FOUND).type('txt').send('Not Found');
});

app.use((err, _req, res, _next) => {
  let errCode, errMessage;

  if (err.errors) {
    errCode = HTTP_ERROR_CODES.BAD_REQUEST;
    errMessage = err.errors[Object.keys(err.errors)[0]].message;
  } else {
    errCode = err.status || HTTP_ERROR_CODES.INTERNAL_SERVER_ERROR;
    errMessage = err.message || 'Internal Server Error';
  }

  res.status(errCode).type('txt').send(errMessage);
});

const startServer = async () => {
  if (IS_TEST) return;

  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

startServer();

// Comment to trigger project test workflow
export default app; // For FCC testing purposes
