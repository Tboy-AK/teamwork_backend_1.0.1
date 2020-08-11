const { compare } = require('bcryptjs');
const { validationResult } = require('express-validator');
const { sign } = require('jsonwebtoken');
const errResHandler = require('../utils/error-response-handler');

const authsController = (UserModel) => {
  const signinUser = async (req, res) => {
    // validate user request data
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return res.status(422).send(validationError.array({ onlyFirstError: true }));
    }

    const reqBody = { ...req.body };

    // check if user exists
    let user;
    try {
      user = UserModel.findByEmail(reqBody.email);
    } catch (err) {
      return errResHandler(res, 401);
    }

    // confirm user password
    return compare(reqBody.password, user.password)
      .then((success) => {
        if (!success) return errResHandler(res, 401, 'Wrong password');

        // create user access token
        const userPayload = {
        // eslint-disable-next-line no-underscore-dangle
          uid: user._id,
        };
        const accessTokenOptions = {
          algorithm: 'HS256', audience: 'user', expiresIn: 600, issuer: 'Teamwork',
        };
        const accessToken = sign(userPayload, process.env.RSA_PRIVATE_KEY, accessTokenOptions);
        const refreshTokenOptions = { ...accessTokenOptions, expiresIn: 30 * 24 * 3600 };
        const refreshToken = sign(userPayload, process.env.RSA_PRIVATE_KEY, refreshTokenOptions);
        const cookieOptions = {
          maxAge: 30 * 24 * 3600000,
          secure: false,
          sameSite: 'none',
          httpOnly: false,
          path: '/api/v1.0.1/auth/refresh-user-session',
          domain: req.hostname !== 'localhost' ? `.${req.hostname}` : 'localhost',
        };

        return res
          .status(201)
          .header('Authorization', accessToken)
          .cookie('Teamwork', refreshToken, cookieOptions)
          .json({
            message: 'Successfully signed in',
            userId: 1,
            accessExp: accessTokenOptions.expiresIn,
            refreshExp: refreshTokenOptions.expiresIn,
          });
      })
      .catch((err) => errResHandler(res, 500, err.message));
  };

  return { signinUser };
};

module.exports = authsController;
