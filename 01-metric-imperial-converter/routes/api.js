'use strict';

var expect = require('chai').expect;
const HTTP_ERROR_CODES = require('../constants/httpErrorCodes');
const ConvertHandler = require('../controllers/convertHandler');
const ConverterInputValidator = require('../validators/converterInputValidator');

module.exports = function(app) {
  
  const convertHandler = new ConvertHandler();

  app.route('/api/convert')
    .get(function ({query: {input}}, res){
      const initNum = convertHandler.getNum(input);
      const initUnit = convertHandler.getUnit(input);
      const validationError = ConverterInputValidator.validate(initNum, initUnit);

      if(validationError) {
        return res.status(HTTP_ERROR_CODES.BAD_REQUEST).json(validationError);
      }

      const returnNum = convertHandler.convert(initNum, initUnit);
      const returnUnit = convertHandler.getReturnUnit(initUnit);
      const message = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);

      res.json({initNum, initUnit, returnNum, returnUnit, string: message});
    });
    
};
