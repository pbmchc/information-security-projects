const request = require('request-promise');

const stockRepository = require('../repositories/stockRepository');
const {prepareErrorPayload} = require('../helpers/errorHelper');
const {parseStringifiedBoolean} = require('../utils/booleanUtils');
const {validateStockRecords} = require('../validators/stockValidator');

const STOCK_FETCHING_ERROR = 'Error while fetching stock';

async function getStock({connection, query: {stock, like}}, res, next) {
    const ip = parseStringifiedBoolean(like) ? connection.remoteAddress : null;
    const tickers = Array.isArray(stock) ? stock : [stock];

    try {
        const records = await Promise.all(tickers.map(ticker => request(_getStockRequestUrl(ticker))));
        const validationError = validateStockRecords(records, tickers);

        if(validationError) {
            return next(prepareErrorPayload(validationError));
        }

        _sendStockData(records, ip, res, next);
    } catch(err) {
        next(prepareErrorPayload(STOCK_FETCHING_ERROR));
    }
}

async function _sendStockData(records, ip, res, next) {
    const stockData = records.length > 1
        ? await _getMultipleStockRecords(records, ip, next)
        : await _getSingleStockRecord(records[0], ip, next);

    res.json(stockData);
}

async function _getMultipleStockRecords(records, ip, next) {
    const stockRecords = await Promise.all(records.map(record => _getSingleStockRecord(record, ip, next)));

    return {
        stockData: _prepareMultipleStockData(stockRecords)
    };
}

async function _getSingleStockRecord(record, ip, next) {
    try {
        return _prepareSingleStockData(record, ip);
    } catch(err) {
        next(prepareErrorPayload(err))
    }
}

function _prepareMultipleStockData(stockRecords) {
    return stockRecords.map(({stockData: {stock, price, likes}}, index, arr)=> {
        const {stockData: {likes: otherStockLikes}} = index ? arr[0] : arr[1];

        return {
            stock,
            price,
            rel_likes: likes - otherStockLikes
        };
    });
}

async function _prepareSingleStockData(record, ip) {
    const {symbol: stock, latestPrice: price} = JSON.parse(record);
    const {likes: {length}} = await stockRepository.getStockTicker(stock, ip);

    return {
        stockData: {
            stock,
            price,
            likes: length
        }
    };
}

function _getStockRequestUrl(stock) {
    return `${process.env.STOCK_API}/stock/${stock.toUpperCase()}/quote`;
}

exports.getStock = getStock;