'use strict';

const mongoose = require('mongoose');

const stockController = require('../controllers/stockController');

mongoose.connect(
  process.env.DB,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);

module.exports = function (app) {
  app.route('/api/stock-prices')
    .get(stockController.getStock);
};
