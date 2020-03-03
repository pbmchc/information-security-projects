const request = require('request-promise');

const stockRepository = require('../repositories/stockRepository');
const {prepareErrorPayload} = require('../helpers/errorHelper');
const {validateStockRecords} = require('../validators/stockValidator');

const STOCK_FETCHING_ERROR = 'Error while fetching stock';

async function getStock({connection, query: {stock, like}}, res, next) {
    const ip = like ? connection.remoteAddress : null;
    const tickers = Array.isArray(stock) ? stock : [stock];

    try {
        const records = await Promise.all(tickers.map(ticker => request(_getStockRequestUrl(ticker))));
        const validationError = validateStockRecords(records, tickers);

        if(validationError) {
            return next(prepareErrorPayload(validationError));
        }

        _prepareStockData(records, ip, res, next);
    } catch(err) {
        next(prepareErrorPayload(STOCK_FETCHING_ERROR));
    }
}

function _prepareStockData(records, ip, res, next) {
    if(records.length > 1) {
        return {
            stockData: records.map(_prepareStockRecord)
        };
    }

    return _getSingleStockRecord(records, ip, res, next);
}

function _prepareStockRecord(record) {
    const {symbol: stock, latestPrice: price} = JSON.parse(record);

    return {
        stock,
        price,
        rel_likes: 0
    };
}

async function _getSingleStockRecord([record], ip, res, next) {
    try {
        res.json(await _prepareSingleStockData(record, ip));
    } catch(err) {
        next(prepareErrorPayload(err))
    }
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