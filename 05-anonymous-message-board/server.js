'use strict';

const PORT = process.env.PORT || 3000;
const express     = require('express');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');
const helmet      = require('helmet');

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

const app = express();

app.use(
  helmet.frameguard(),
  helmet.dnsPrefetchControl(),
  helmet.referrerPolicy({policy: 'same-origin'})
);

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(cors({origin: '*'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route('/b/:board/')
  .get(function (_, res) {
    res.sendFile(`${process.cwd()}/views/board.html`);
  });
app.route('/b/:board/:threadid')
  .get(function (_, res) {
    res.sendFile(`${process.cwd()}/views/thread.html`);
  });

app.route('/')
  .get(function (_, res) {
    res.sendFile(`${process.cwd()}/views/index.html`);
  });

fccTestingRoutes(app);
apiRoutes(app);

app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});

module.exports = app;
