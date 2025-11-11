import { Ticker } from '../models/ticker.js';
import { CustomError } from '../utils/errorUtils.js';

const TICKER_CREATE_ERROR = (symbol) => `Error while creating ticker ${symbol}`;
const TICKER_FIND_ERROR = (symbol) => `Error while trying to find ticker ${symbol}`;
const TICKER_LIKES_UPDATE_ERROR = (symbol) => `Error while updating likes for ticker ${symbol}`;

async function createTicker(symbol, ip) {
  const ticker = new Ticker({ symbol, likes: ip ? [ip] : [] });

  try {
    const result = await ticker.save();
    return result;
  } catch {
    throw new CustomError(TICKER_CREATE_ERROR(symbol));
  }
}

async function updateTickerLikes(symbol, ip) {
  const options = { new: true, setDefaultsOnInsert: true, upsert: true };
  const update = ip ? { symbol, $addToSet: { likes: ip } } : { symbol };

  try {
    const result = await Ticker.findOneAndUpdate({ symbol }, update, options);
    return result;
  } catch {
    throw new CustomError(TICKER_LIKES_UPDATE_ERROR(symbol));
  }
}

export async function findTicker(symbol, ip) {
  try {
    const existingTicker = await Ticker.findOne({ symbol });

    if (existingTicker) {
      if (ip) return updateTickerLikes(symbol, ip);
      return existingTicker;
    }

    return createTicker(symbol, ip);
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError(TICKER_FIND_ERROR(symbol));
  }
}
