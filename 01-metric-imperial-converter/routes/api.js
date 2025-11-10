import { HTTP_ERROR_CODES } from '../constants/httpErrorCodes.js';
import { ConvertHandler } from '../controllers/convertHandler.js';
import { ConverterInputValidator } from '../validators/converterInputValidator.js';

export const setupRoutes = (app) => {
  const convertHandler = new ConvertHandler();
  const converterInputValidator = new ConverterInputValidator();

  app.route('/api/convert').get(function ({ query: { input } }, res) {
    const initNum = convertHandler.getNum(input);
    const initUnit = convertHandler.getUnit(input);
    const validationError = converterInputValidator.validate(initNum, initUnit);

    if (validationError) {
      return res.status(HTTP_ERROR_CODES.BAD_REQUEST).json(validationError);
    }

    const returnNum = convertHandler.convert(initNum, initUnit);
    const returnUnit = convertHandler.getReturnUnit(initUnit);
    const message = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);

    res.json({ initNum, initUnit, returnNum, returnUnit, string: message });
  });
};
