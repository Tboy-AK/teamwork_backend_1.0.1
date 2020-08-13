/* eslint-disable no-underscore-dangle */
const { validationResult } = require('express-validator');
const errResHandler = require('../utils/error-response-handler');

const articlesController = (ArticleModel) => {
  const createArticle = async (req, res) => {
    // validate user request data
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return errResHandler(res, 422, validationError.array({ onlyFirstError: true }));
    }

    // save article to database
    let newArticle;
    try {
      const { title, article } = req.body;
      newArticle = await ArticleModel.createArticle(title, article, req.userPayload.uid);
    } catch (err) {
      if (err.code === '23000' || err.code === '23503') return errResHandler(res, 406, 'Unauthenticated request');
      return errResHandler(res, 500, err.message);
    }

    return res
      .status(201)
      .json({
        message: 'Article successfully posted',
        articleId: newArticle._id,
        title: newArticle.title,
        article: newArticle.article,
        createdOn: newArticle.created_at,
      });
  };

  return { createArticle };
};

module.exports = articlesController;
