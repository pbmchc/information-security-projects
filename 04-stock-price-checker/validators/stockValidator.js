const STOCK_UNKNOWN_SYMBOL_ERROR = 'Unknown symbol';

function validateStockRecords(records, tickers) {
    const errorIndex = records.findIndex(record => record.includes(STOCK_UNKNOWN_SYMBOL_ERROR));

    return errorIndex !== -1
        ? `${STOCK_UNKNOWN_SYMBOL_ERROR}: ${tickers[errorIndex]}`
        : null;
}

exports.validateStockRecords = validateStockRecords;