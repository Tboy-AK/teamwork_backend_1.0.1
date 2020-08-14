/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const { validationResult } = require('express-validator');
const errResHandler = require('../utils/error-response-handler');

const articlesController = (FeedModel) => {
  const getFeed = async (req, res) => {
    // validate user request data
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return errResHandler(res, 422, validationError
        .array({ onlyFirstError: true }).map(({ msg }) => msg));
    }

    // get feed from database
    let feed;
    const { pagination_limit, pagination_offset } = req.query;
    try {
      feed = await FeedModel.getFeed(pagination_limit, pagination_offset);
      return res.status(200).json(feed);
    } catch (err) {
      return errResHandler(res, 500, err.message);
    }
  };

  return { getFeed };
};

module.exports = articlesController;
