const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  const decodedToken = jwt.verify(
    req.header('x-auth-token'),
    config.get('jwtPrivateKey')
  );
  const today = new Date().getTime();
  if (today < decodedToken.tokenEndDate) {
    if (decodedToken.tokenEndDate - today < 300000) {
      const tokenEndDate = new Date().getTime() + 18000000;
      decodedToken.tokenEndDate = tokenEndDate;
      const token = jwt.sign(decodedToken, config.get('jwtPrivateKey'));
      req.token = token;
      return next();
    }
    return next();
  } else {
  }
  res.status(401).send('Token is out of date.');
};
