const express = require('express');
const FeedModel = require('../models/feed-model');
const { getFeed } = require('../controllers/feed-controller')(FeedModel);
const feedValidator = require('../middleware/validators/feed-validator');
const { verifyUserAccessToken } = require('../middleware/token-verifier');

const FeedRouter = express.Router();

FeedRouter
  .route('/feed')
  .get(verifyUserAccessToken, feedValidator, getFeed);

module.exports = { FeedRouter };
