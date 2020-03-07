const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const Ticker = require('../models/ticker');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('GET /api/stock-prices => stockData object', () => {
      const STOCK = 'goog';
      const STOCKS = ['amzn', 'msft'];
      const clearTestCollection = (done) => Ticker.deleteMany({}).then(() => done());

      before((done) => {
        clearTestCollection(done);
      });

      after((done) => {
        clearTestCollection(done);
      });

      test('1 stock', (done) => {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: STOCK})
        .end((err, {body, status}) => {
          if(err) return done(err);

          const {stockData: {stock, price, likes}} = body;

          assert.equal(status, 200);
          assert.equal(stock, STOCK.toUpperCase());
          assert.isNumber(price);
          assert.isNumber(likes);
          assert.equal(likes, 0);
          done();
        });
      });
      
      test('1 stock with like', (done) => {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: STOCK, like: true})
          .end((err, {body, status}) => {
            if(err) return done(err);

            const {stockData: {stock, price, likes}} = body;

            assert.equal(status, 200);
            assert.equal(stock, STOCK.toUpperCase());
            assert.isNumber(price);
            assert.isNumber(likes);
            assert.equal(likes, 1);
            done();
          });
      });
      
      test('1 stock with like again (ensure likes aren\'t double counted)', (done) => {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: STOCK, like: true})
          .end((err, {body, status}) => {
            if(err) return done(err);

            const {stockData: {stock, price, likes}} = body;

            assert.equal(status, 200);
            assert.equal(stock, STOCK.toUpperCase());
            assert.isNumber(price);
            assert.isNumber(likes);
            assert.equal(likes, 1);
            done();
          });
      });
      
      test('2 stocks', (done) => {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: STOCKS})
          .end((err, {body, status}) => {
            if(err) return done(err);

            const {stockData} = body;
            const [tickerA, tickerB] = stockData;

            assert.equal(status, 200);
            assert.isArray(stockData);
            assert.equal(stockData.length, 2);
            assert.equal(tickerA.stock, STOCKS[0].toUpperCase());
            assert.isNumber(tickerA.price);
            assert.isNumber(tickerA.rel_likes);
            assert.equal(tickerA.rel_likes, 0);
            assert.equal(tickerB.stock, STOCKS[1].toUpperCase());
            assert.isNumber(tickerB.price);
            assert.isNumber(tickerB.rel_likes);
            assert.equal(tickerB.rel_likes, 0);
            done();
          });
      });
      
      test('2 stocks with like', (done) => {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: STOCKS, like: true})
          .end((err, {body, status}) => {
            if(err) return done(err);

            const {stockData} = body;
            const [tickerA, tickerB] = stockData;

            assert.equal(status, 200);
            assert.isArray(stockData);
            assert.equal(stockData.length, 2);
            assert.equal(tickerA.stock, STOCKS[0].toUpperCase());
            assert.isNumber(tickerA.price);
            assert.isNumber(tickerA.rel_likes);
            assert.equal(tickerA.rel_likes, 0);
            assert.equal(tickerB.stock, STOCKS[1].toUpperCase());
            assert.isNumber(tickerB.price);
            assert.isNumber(tickerB.rel_likes);
            assert.equal(tickerB.rel_likes, 0);
            done();
          });
      });
    });
});
