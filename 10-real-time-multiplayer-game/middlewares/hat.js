export default {
  fakePoweredBy(setTo) {
    return (_req, res, next) => {
      res.setHeader('X-Powered-By', setTo);
      next();
    };
  },
};
