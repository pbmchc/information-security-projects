import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { HTTP_ERROR_CODES } from './constants/httpErrorCodes.js';
import hat from './middlewares/hat.js';
import { setupRoutes } from './routes/api.js';
import { setupTestingRoutes } from './routes/fcctesting.js';
import runner from './test-runner.js';

const ENV = process.env.NODE_ENV || 'development';
const IS_DEV = ENV === 'development';
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({ origin: '*' })); // For FCC testing purposes

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(hat.contentNonce());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'code.jquery.com', (_req, res) => `'nonce-${res.locals.nonce}'`],
      styleSrc: ["'self'"],
      upgradeInsecureRequests: IS_DEV ? null : [],
    },
    useDefaults: false,
  })
);
app.use(helmet.xPoweredBy());
app.use(helmet.xXssProtection());

app.use('/static', express.static('public'));
app.set('view engine', 'ejs');

app.route('/:project/').get(function (_, res) {
  res.render('issue');
});

app.route('/').get(function (_, res) {
  res.render('index');
});

setupTestingRoutes(app); // For FCC testing purposes
setupRoutes(app);

app.use(function (_req, res, _next) {
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

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (err) {
        console.log('Error while running tests:');
        console.log(err);
      }
    }, 3500);
  }
});

export default app; // For FCC testing purposes
