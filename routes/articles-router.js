const express = require('express');
const ArticleModel = require('../models/articles-model');
const { createArticle, updateArticle, deleteArticle } = require('../controllers/articles-controller')(ArticleModel);
const createArticleValidator = require('../middleware/validators/user-create-article-validator');
const updateArticleValidator = require('../middleware/validators/user-update-article-validator');
const deleteArticleValidator = require('../middleware/validators/user-delete-article-validator');
const { verifyUserAccessToken } = require('../middleware/token-verifier');

const ArticlesRouter = express.Router();

ArticlesRouter
  .route('/articles')
  .post(verifyUserAccessToken, createArticleValidator, createArticle);

ArticlesRouter
  .route('/articles/:articleId')
  .patch(verifyUserAccessToken, updateArticleValidator, updateArticle)
  .delete(verifyUserAccessToken, deleteArticleValidator, deleteArticle);

module.exports = { ArticlesRouter };
