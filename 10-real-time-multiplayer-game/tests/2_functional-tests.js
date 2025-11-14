import * as chai from 'chai';
import chaiHttp, { request } from 'chai-http';

import app from '../server.js';

const { assert } = chai;
chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('Headers test', () => {
    test("The headers say that the site is powered by 'PHP 7.4.3'.", async () => {
      const res = await request.execute(app).get('/');
      assert.strictEqual(res.header['x-powered-by'], 'PHP 7.4.3');
    });

    test('Prevent cross-site scripting (XSS) attacks.', async () => {
      const res = await request.execute(app).get('/');

      assert.include(res.header['content-security-policy'], "script-src 'self'");
      assert.strictEqual(res.header['x-xss-protection'], '0');
    });

    test('Prevent the client from trying to guess / sniff the MIME type.', async () => {
      const res = await request.execute(app).get('/');
      assert.strictEqual(res.header['x-content-type-options'], 'nosniff');
    });

    test('Nothing from the website is cached in the client.', async () => {
      const res = await request.execute(app).get('/');

      assert.strictEqual(
        res.header['cache-control'],
        'no-store, no-cache, must-revalidate, proxy-revalidate'
      );
      assert.strictEqual(res.header['surrogate-control'], 'no-store');
      assert.strictEqual(res.header['expires'], '0');
    });
  });
});
