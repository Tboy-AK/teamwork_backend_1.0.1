const express = require('express');
const EmployeeModel = require('../mocks/models/employee-model');
const { createUser } = require('../controllers/users-controller')(EmployeeModel);
const createUserValidator = require('../middleware/validators/create-user-validator');

const UsersRouter = express.Router();

UsersRouter
  .route('/auth/create-user')
  .post(createUserValidator, createUser);

module.exports = { UsersRouter };
