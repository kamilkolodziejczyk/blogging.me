const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  if (!req.header('x-auth-token')) {
    return res.status(401).send('Invalid token');
  }
  const decodedToken = jwt.verify(
    req.header('x-auth-token'),
    config.get('jwtPrivateKey')
  );
  const today = new Date().getTime();
  if (today < decodedToken.tokenEndDate) {
    if (decodedToken.tokenEndDate - today < 300000) {
      decodedToken.tokenEndDate = new Date().getTime() + 18000000;
      req.token = jwt.sign(decodedToken, config.get('jwtPrivateKey'));
      return next();
    }
    return next();
  } else {
    res.status(401).send('Token is out of date.');
  }
};
