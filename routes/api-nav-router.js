const express = require('express');
const { getViews } = require('../controllers/api-nav-controller')();

const ApiNavRouter = express.Router();

ApiNavRouter
  .route('/')
  .get(getViews);

module.exports = { ApiNavRouter };
