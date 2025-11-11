import axios from 'axios';

import * as stockRepository from '../repositories/stockRepository.js';
import { toBoolean } from '../utils/booleanUtils.js';
import { toHttpError } from '../utils/errorUtils.js';
import { validateStockRatings } from '../validators/stockValidator.js';

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

export async function getStock({ connection, query: { stock, like } }, res, next) {
  const ip = toBoolean(like) ? connection.remoteAddress : null;
  const tickers = Array.isArray(stock) ? stock.slice(0, 2) : [stock];

  try {
    const ratings = await Promise.all(
      tickers.map(async (ticker) => {
        const tickerUrl = `${process.env.STOCK_API}/stock/${ticker.toLowerCase()}/quote`;
        const { data: tickerData } = await axios.get(tickerUrl);

        return tickerData;
      })
    );

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
    return next(toHttpError(err));
  }
}
