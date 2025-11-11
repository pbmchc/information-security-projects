import mongoose from 'mongoose';

import * as stockController from '../controllers/stockController.js';

mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB);

export const setupRoutes = (app) => {
  app.route('/api/stock-prices').get(stockController.getStock);
};
