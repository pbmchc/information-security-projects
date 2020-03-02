const request = require('request');

const {prepareErrorPayload} = require('../helpers/errorHelper');

const STOCK_FETCHING_ERROR = 'Error while fetching stock';

function getStock(req, res, next) {
    const {query: {stock}} = req;

    request(_getStockRequestUrl(stock), (err, {body}) => {
        if(err) {
            return next(prepareErrorPayload(STOCK_FETCHING_ERROR));
        }

        res.json(_getStockData(body));
    });
}

function _getStockData(data) {
    const {symbol: stock, latestPrice: price} = JSON.parse(data);

    return {
        stock,
        price,
        likes: 0
    };
}

function _getStockRequestUrl(stock) {
    return `${process.env.STOCK_API}/stock/${stock.toUpperCase()}/quote`;
}

exports.getStock = getStock;