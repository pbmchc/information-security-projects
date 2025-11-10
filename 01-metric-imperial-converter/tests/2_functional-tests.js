import * as chai from 'chai';
import chaiHttp, { request } from 'chai-http';

import app from '../server.js';
import { CONVERTER_ERRORS } from '../validators/converterInputValidator.js';
const REQUEST_URL = '/api/convert';

const { assert } = chai;
chai.use(chaiHttp);

suite('Functional Tests', function () {
  suite('Routing Tests', function () {
    suite('GET /api/convert => conversion object', function () {
      test('Convert 10L (valid input)', function (done) {
        request
          .execute(app)
          .get(REQUEST_URL)
          .query({ input: '10L' })
          .end(function (_, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.initNum, 10);
            assert.equal(res.body.initUnit, 'L');
            assert.approximately(res.body.returnNum, 2.64172, 0.1);
            assert.equal(res.body.returnUnit, 'gal');
            done();
          });
      });

      test('Convert 32g (invalid input unit)', function (done) {
        request
          .execute(app)
          .get(REQUEST_URL)
          .query({ input: '32g' })
          .end(function (_, res) {
            assert.equal(res.status, 400);
            assert.equal(res.body.error, CONVERTER_ERRORS.UNIT);
            done();
          });
      });

      test('Convert 3/7.2/4kg (invalid number)', function (done) {
        request
          .execute(app)
          .get(REQUEST_URL)
          .query({ input: '3/7.2/4kg' })
          .end(function (_, res) {
            assert.equal(res.status, 400);
            assert.equal(res.body.error, CONVERTER_ERRORS.VALUE);
            done();
          });
      });

      test('Convert 3/7.2/4kilomegagram (invalid number and unit)', function (done) {
        request
          .execute(app)
          .get(REQUEST_URL)
          .query({ input: '3/7.2/4kilomegagram' })
          .end(function (_, res) {
            assert.equal(res.status, 400);
            assert.equal(res.body.error, CONVERTER_ERRORS.ALL);
            done();
          });
      });

      test('Convert kg (no number)', function (done) {
        request
          .execute(app)
          .get(REQUEST_URL)
          .query({ input: 'kg' })
          .end(function (_, res) {
            assert.equal(res.status, 400);
            assert.equal(res.body.error, CONVERTER_ERRORS.VALUE);
            done();
          });
      });
    });
  });
});
