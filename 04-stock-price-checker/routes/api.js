'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');

const stockController = require('../controllers/stockController'); 

const CONNECTION_STRING = process.env.DB;

module.exports = function (app) {
  app.route('/api/stock-prices')
    .get(stockController.getStock);
};
