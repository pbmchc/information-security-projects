'use strict';

require('dotenv').config();

var express     = require('express');
var bodyParser  = require('body-parser');
var expect      = require('chai').expect;
var cors        = require('cors');
const helmet    = require('helmet');

var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');

var app = express();

const PORT = process.env.PORT || 3000;

app.use(helmet.xssFilter());

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route('/:project/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
  });

app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
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
    }, 3500);
  }
});

module.exports = app;
