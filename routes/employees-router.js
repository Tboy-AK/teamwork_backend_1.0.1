const express = require('express');
const EmployeeModel = require('../models/employees-model');
const { createEmployee } = require('../controllers/employees-controller')(EmployeeModel);
const createEmployeeValidator = require('../middleware/validators/create-user-validator');

const UsersRouter = express.Router();

UsersRouter
  .route('/auth/create-user')
  .post(createEmployeeValidator, createEmployee);

module.exports = { UsersRouter };
