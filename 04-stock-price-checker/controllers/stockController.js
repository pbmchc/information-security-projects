const request = require('request-promise');

const {prepareErrorPayload} = require('../helpers/errorHelper');
const {validateStockRecords} = require('../validators/stockValidator');

const STOCK_FETCHING_ERROR = 'Error while fetching stock';

async function getStock(req, res, next) {
    const {query: {stock}} = req;
    const tickers = Array.isArray(stock) ? stock : [stock];

    try {
        const records = await Promise.all(tickers.map(ticker => request(_getStockRequestUrl(ticker))));
        const validationError = validateStockRecords(records, tickers);

        if(validationError) {
            return next(prepareErrorPayload(validationError));
        }

        res.json(_prepareStockData(records));
    } catch(err) {
        next(prepareErrorPayload(STOCK_FETCHING_ERROR));
    }
}

function _prepareStockData(records) {
    if(records.length > 1) {
        return {
            stockData: records.map(_prepareStockRecord)
        };
    }

    return _prepareSingleStockRecord(records);
}

function _prepareStockRecord(record) {
    return {
        ..._prepareBaseStockData(record),
        rel_likes: 0
    };
}

function _prepareSingleStockRecord([record]) {
    return {
        stockData: {
            ..._prepareBaseStockData(record),
            likes: 0
        }
    };
}

function _prepareBaseStockData(record) {
    const {symbol: stock, latestPrice: price} = JSON.parse(record);

    return {stock, price};
}

function _getStockRequestUrl(stock) {
    return `${process.env.STOCK_API}/stock/${stock.toUpperCase()}/quote`;
}

exports.getStock = getStock;