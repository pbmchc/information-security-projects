import * as stockRepository from '../repositories/stockRepository.js';
import { toBoolean } from '../utils/booleanUtils.js';
import { CustomError, toHttpError } from '../utils/errorUtils.js';
import { validateStockRatings } from '../validators/stockValidator.js';

const TICKER_FETCH_ERROR = (ticker) => `Error while fetching ticker ${ticker}`;

async function toSingleStockTicker(rating, ip) {
  const { symbol: stock, latestPrice: price } = rating;
  const {
    likes: { length },
  } = await stockRepository.findTicker(stock, ip);

  return { stockData: { stock, price, likes: length } };
}

async function toPairOfStockTickers(ratings, ip) {
  const stockTickers = await Promise.all(ratings.map((rating) => toSingleStockTicker(rating, ip)));

  return {
    stockData: stockTickers.map(({ stockData: { stock, price, likes } }, index, arr) => {
      const {
        stockData: { likes: otherStockLikes },
      } = index ? arr[0] : arr[1];

      return { stock, price, rel_likes: likes - otherStockLikes };
    }),
  };
}

async function fetchStockTicker(ticker) {
  const url = `${process.env.STOCK_API}/stock/${ticker.toLowerCase()}/quote`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new CustomError(TICKER_FETCH_ERROR(ticker));
  }

  return response.json();
}

export async function getStock({ connection, query: { stock, like } }, res, next) {
  const ip = toBoolean(like) ? connection.remoteAddress : null;
  const tickers = Array.isArray(stock) ? stock.slice(0, 2) : [stock];

  try {
    const ratings = await Promise.all(tickers.map((ticker) => fetchStockTicker(ticker)));

    const validationError = validateStockRatings(ratings, tickers);
    if (validationError) {
      return next({ errors: [{ message: validationError }] });
    }

    const result =
      ratings.length > 1
        ? await toPairOfStockTickers(ratings, ip)
        : await toSingleStockTicker(ratings[0], ip);

    return res.json(result);
  } catch (err) {
    console.error(err instanceof Error ? err.message : 'Error while getting stock prices');
    return next(toHttpError(err));
  }
}
