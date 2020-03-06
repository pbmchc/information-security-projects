const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const Ticker = require('../models/ticker');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('GET /api/stock-prices => stockData object', () => {
      const STOCK = 'goog';
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
        .end((_, {body, status}) => {
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
          .end((_, {body, status}) => {
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
          .end((_, {body, status}) => {
            const {stockData: {stock, price, likes}} = body;

            assert.equal(status, 200);
            assert.equal(stock, STOCK.toUpperCase());
            assert.isNumber(price);
            assert.isNumber(likes);
            assert.equal(likes, 1);
            done();
          });
      });
      
      test('2 stocks', function(done) {
        
      });
      
      test('2 stocks with like', function(done) {
        
      });
    });
});
