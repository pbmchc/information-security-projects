import * as crypto from 'node:crypto';

export default {
  contentNonce() {
    return (_req, res, next) => {
      res.locals.nonce = crypto.randomBytes(16).toString('hex');
      next();
    };
  },
};
