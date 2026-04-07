import * as chai from 'chai';
import chaiHttp, { request } from 'chai-http';
import nock from 'nock';

import app from '../server.js';
import { setupTestDatabase, teardownTestDatabase } from './setup.js';
import { SINGLE_TICKER_TEST_CASES, MULTIPLE_TICKERS_TEST_CASES } from './test-cases.js';

const { assert } = chai;
chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('GET /api/stock-prices => stockData object', () => {
    const setupRequestInterceptor = (ticker) => {
      const basePath = process.env.STOCK_API;
      nock(basePath)
        .get((url) => url.includes(`/stock/${ticker}`))
        .reply(200, {
          latestPrice: 123.45,
          symbol: ticker.toUpperCase(),
        });
    };

    suiteSetup(async () => {
      await setupTestDatabase();
    });

    suiteTeardown(async () => {
      await teardownTestDatabase();
    });

    SINGLE_TICKER_TEST_CASES.forEach(({ description, ticker, like, expectedLikeCount }) => {
      setupRequestInterceptor(ticker);

      test(description, async () => {
        const { body, status } = await request
          .execute(app)
          .get('/api/stock-prices')
          .query({ stock: ticker, like });

        const {
          stockData: { stock, price, likes },
        } = body;

        assert.equal(status, 200);
        assert.equal(stock, ticker.toUpperCase());
        assert.isNumber(price);
        assert.isNumber(likes);
        assert.equal(likes, expectedLikeCount);
      });
    });

    MULTIPLE_TICKERS_TEST_CASES.forEach(({ description, tickers, like }) => {
      tickers.forEach((ticker) => setupRequestInterceptor(ticker));

      test(description, async () => {
        const { body, status } = await request
          .execute(app)
          .get('/api/stock-prices')
          .query({ stock: tickers, like });

        const { stockData } = body;
        const [tickerA, tickerB] = stockData;

        assert.equal(status, 200);
        assert.isArray(stockData);
        assert.equal(stockData.length, 2);
        assert.equal(tickerA.stock, tickers[0].toUpperCase());
        assert.isNumber(tickerA.price);
        assert.isNumber(tickerA.rel_likes);
        assert.equal(tickerA.rel_likes, 0);
        assert.equal(tickerB.stock, tickers[1].toUpperCase());
        assert.isNumber(tickerB.price);
        assert.isNumber(tickerB.rel_likes);
        assert.equal(tickerB.rel_likes, 0);
      });
    });
  });
});
