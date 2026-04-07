import * as stockController from '../controllers/stockController.js';

export const setupRoutes = (app) => {
  app.route('/api/stock-prices').get(stockController.getStock);
};
