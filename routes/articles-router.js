const express = require('express');
const ArticleModel = require('../models/articles-model');
const {
  createArticle, updateArticle, deleteArticle, getArticle,
} = require('../controllers/articles-controller')(ArticleModel);
const createArticleValidator = require('../middleware/validators/user-create-article-validator');
const updateArticleValidator = require('../middleware/validators/user-update-article-validator');
const deleteArticleValidator = require('../middleware/validators/user-delete-article-validator');
const getArticleValidator = require('../middleware/validators/user-get-article-validator');
const { verifyUserAccessToken } = require('../middleware/token-verifier');

const ArticlesRouter = express.Router();

ArticlesRouter
  .route('/articles')
  .post(verifyUserAccessToken, createArticleValidator, createArticle);

ArticlesRouter
  .use('/articles/:articleId', verifyUserAccessToken)
  .route('/articles/:articleId')
  .patch(updateArticleValidator, updateArticle)
  .delete(deleteArticleValidator, deleteArticle)
  .get(getArticleValidator, getArticle);

module.exports = { ArticlesRouter };
