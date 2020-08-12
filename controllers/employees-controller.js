/* eslint-disable no-underscore-dangle */
const { hash, genSaltSync } = require('bcryptjs');
const { validationResult } = require('express-validator');
const { sign } = require('jsonwebtoken');
const errResHandler = require('../utils/error-response-handler');

const employeesController = (EmployeeModel) => {
  const createEmployee = async (req, res) => {
    // validate user request data
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return errResHandler(res, 422, validationError.array({ onlyFirstError: true }));
    }

    // get request data for utilization purposes
    const reqBody = { ...req.body };

    // hash user password
    return hash(reqBody.password, genSaltSync(10))
      .then(async (hashString) => {
        // overwrite password with its hash version
        reqBody.password = hashString;

        // save user data to database
        let newEmployee;
        try {
          const {
            email, password, firstName, lastName, gender, address, jobRole, department,
          } = reqBody;
          newEmployee = await EmployeeModel.createEmployee(
            email, password, firstName, lastName, gender, address, jobRole, department,
          );
        } catch (err) {
          if (err.code === '23505') return errResHandler(res, 403, 'User already exists.');
          return errResHandler(res, 500, err.message);
        }

        // create user access token
        const userPayload = {
          // eslint-disable-next-line no-underscore-dangle
          uid: newEmployee._id,
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
            message: 'User account successfully created',
            userId: newEmployee._id,
            accessExp: accessTokenOptions.expiresIn,
            refreshExp: refreshTokenOptions.expiresIn,
          });
      })
      .catch((err) => errResHandler(res, 500, err.message));
  };

  return { createEmployee };
};

module.exports = employeesController;
