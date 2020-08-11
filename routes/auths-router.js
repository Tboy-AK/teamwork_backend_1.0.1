const express = require('express');
const AuthModel = require('../mocks/models/auth-model');
const { signinUser } = require('../controllers/auths-controller')(AuthModel);
const createUserValidator = require('../middleware/validators/signin-user-validator');

const AuthsRouter = express.Router();

AuthsRouter
  .route('/auth/signin')
  .post(createUserValidator, signinUser);

module.exports = { AuthsRouter };
