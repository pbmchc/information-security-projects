const request = require('request-promise');

const {prepareErrorPayload} = require('../helpers/errorHelper');

const STOCK_FETCHING_ERROR = 'Error while fetching stock';
const STOCK_UNKNOWN_SYMBOL_ERROR = 'Unknown symbol';

async function getStock(req, res, next) {
    const {query: {stock}} = req;
    const tickers = Array.isArray(stock) ? stock : [stock];

    try {
        const records = await Promise.all(
            tickers.map(ticker => request(_getStockRequestUrl(ticker)))
        );

        res.json(_prepareStockData(records));
    } catch(err) {
        next(prepareErrorPayload(STOCK_FETCHING_ERROR));
    }
}

function _prepareStockData(records) {
    if(records.length > 1) {
        return {
            stockData: records.map(record => ({
                ..._prepareBaseStockData(record),
                rel_likes: 0
            }))
        };
    }

    return _prepareSingleStockRecord(records);
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