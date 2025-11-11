const STOCK_INVALID_SYMBOL_ERROR = 'Invalid symbol';
const STOCK_SYMBOL_ERROR_REGEX = /(Invalid|Unknown) symbol/;

export function validateStockRatings(ratings, tickers) {
  const errorIndex = ratings.findIndex((rating) => STOCK_SYMBOL_ERROR_REGEX.test(rating));
  return errorIndex !== -1 ? `${STOCK_INVALID_SYMBOL_ERROR}: ${tickers[errorIndex]}` : null;
}
