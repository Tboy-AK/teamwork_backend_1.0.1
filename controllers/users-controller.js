/* eslint-disable no-underscore-dangle */
const { hash, genSaltSync } = require('bcryptjs');
const { validationResult } = require('express-validator');
const errResHandler = require('../utils/error-response-handler');

const usersController = (UserModel) => {
  const createUser = async (req, res) => {
    // validate user request data
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return errResHandler(res, 422, validationError.array({ onlyFirstError: true }));
    }

    // get request data for utilization purposes
    const reqBody = { ...req.body };

    // hash user password
    return hash(reqBody.password, genSaltSync(10))
      .then((hashString) => {
        // overwrite password with its hash version
        reqBody.password = hashString;

        // save user data to database
        let newUser;
        try {
          newUser = UserModel.createEmployee(reqBody);
        } catch (err) {
          return errResHandler(res, 403, 'User already exists.');
        }

        return res.status(201).json({
          message: 'User account successfully created',
          userId: newUser._id,
        });
      })
      .catch((err) => errResHandler(res, 500, err.message));
  };

  return { createUser };
};

module.exports = usersController;
