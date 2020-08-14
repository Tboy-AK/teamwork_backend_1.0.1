const { verify, TokenExpiredError } = require('jsonwebtoken');
const errorResponseHandler = require('../utils/error-response-handler');

const verifyUserAccessToken = (req, res, next) => {
  const userAccessToken = req.headers.authorization;
  try {
    const userPayload = verify(userAccessToken, process.env.RSA_PRIVATE_KEY);
    req.userPayload = userPayload;
    return next();
  } catch (err) {
    if (err instanceof TokenExpiredError) return errorResponseHandler(res, 403, 'Session expired');
    return errorResponseHandler(res, 403);
  }
};

module.exports = { verifyUserAccessToken };
