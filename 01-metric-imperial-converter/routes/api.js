/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  var convertHandler = new ConvertHandler();

  app.route('/api/convert')
    .get(function ({query: {input}}, res){
      const initNum = convertHandler.getNum(input);
      const initUnit = convertHandler.getUnit(input);
      const returnNum = convertHandler.convert(initNum, initUnit);
      const returnUnit = convertHandler.getReturnUnit(initUnit);
      const message = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);

      return res.json({
        initNum,
        initUnit,
        returnNum,
        returnUnit,
        string: message
      });
    });
    
};
