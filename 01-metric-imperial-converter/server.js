import express from 'express';
import helmet from 'helmet';

import { HTTP_ERROR_CODES } from './constants/httpErrorCodes.js';
import hat from './middlewares/hat.js';
import { setupRoutes } from './routes/api.js';

const ENV = process.env.NODE_ENV || 'development';
const IS_DEV = ENV === 'development';
const PORT = process.env.PORT || 3000;

var app = express();

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
app.use(helmet.xContentTypeOptions());
app.use(helmet.xPoweredBy());
app.use(helmet.xXssProtection());

app.use('/static', express.static('public'));
app.set('view engine', 'ejs');

app.route('/').get(function (_, res) {
  res.render('index');
});

setupRoutes(app);

app.use(function (_req, res, _next) {
  res.status(HTTP_ERROR_CODES.NOT_FOUND).type('txt').send('Not Found');
});

app.listen(PORT, function () {
  console.log(`Listening on port: ${PORT}`);
});

export default app; // For FCC testing purposes
