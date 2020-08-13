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
      if (err.code === '23000' || err.code === '23503') return errResHandler(res, 403, 'Unauthorized request');
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

  const updateArticle = async (req, res) => {
    // validate user request data
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return errResHandler(res, 422, validationError.array({ onlyFirstError: true }));
    }

    // save article update to database
    let newArticle;
    try {
      const { title, article } = req.body;
      newArticle = await ArticleModel.updateArticle(
        req.params.articleId, title, article, req.userPayload.uid,
      );
    } catch (err) {
      if (err.code === '23000' || err.code === '23503') return errResHandler(res, 403, 'Unauthorized request');
      if (err.code === 'ENULL') return errResHandler(res, 406, err.message);
      return errResHandler(res, 500, err.message);
    }

    return res
      .status(201)
      .json({
        message: 'Article successfully updated',
        articleId: newArticle._id,
        title: newArticle.title,
        article: newArticle.article,
        createdOn: newArticle.created_at,
        updatedOn: newArticle.modified_at,
      });
  };

  const deleteArticle = async (req, res) => {
    // validate user request data
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return errResHandler(res, 422, validationError.array({ onlyFirstError: true }));
    }

    // delete article from database
    try {
      await ArticleModel.deleteArticle(
        req.params.articleId, req.userPayload.uid,
      );
      return res.status(200).send('Article successfully deleted');
    } catch (err) {
      if (err.code === 'ENULL') return errResHandler(res, 403, 'Unauthorized request');
      return errResHandler(res, 500, err.message);
    }
  };

  return { createArticle, updateArticle, deleteArticle };
};

module.exports = articlesController;
