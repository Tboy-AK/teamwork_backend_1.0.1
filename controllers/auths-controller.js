/* eslint-disable no-underscore-dangle */
const { compare } = require('bcryptjs');
const { validationResult } = require('express-validator');
const { sign } = require('jsonwebtoken');
const errResHandler = require('../utils/error-response-handler');

const authsController = (AuthModel) => {
  const signinUser = async (req, res) => {
    // validate user request data
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return res.status(422).send(validationError.array({ onlyFirstError: true }));
    }

    const { email, password } = req.body;

    // check if user exists
    let user;
    try {
      user = await AuthModel.getOneByEmail(email);
    } catch (err) {
      if (err.code === 'ENULL') return errResHandler(res, 401, 'User not recognized');
      if (err.code === 'ECOUNT') return errResHandler(res, 501, err.message);
      return errResHandler(res, 500, err.message);
    }

    // confirm user password
    return compare(password, user.password)
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
          httpOnly: true,
          path: '/api/v1.0.1/auth/refresh-user-session',
          domain: req.hostname !== 'localhost' ? `.${req.hostname}` : 'localhost',
        };

        return res
          .status(201)
          .header('Authorization', accessToken)
          .cookie('Teamwork', refreshToken, cookieOptions)
          .json({
            message: 'Successfully signed in',
            userId: user._id,
            accessExp: accessTokenOptions.expiresIn,
            refreshExp: refreshTokenOptions.expiresIn,
          });
      })
      .catch((err) => errResHandler(res, 500, err.message));
  };

  return { signinUser };
};

module.exports = authsController;
