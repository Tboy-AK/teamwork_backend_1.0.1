const express = require('express');
const ArticleModel = require('../models/articles-model');
const { createArticle } = require('../controllers/articles-controller')(ArticleModel);
const createArticleValidator = require('../middleware/validators/user-create-article-validator');
const { verifyUserAccessToken } = require('../middleware/token-verifier');

const ArticlesRouter = express.Router();

ArticlesRouter
  .route('/articles')
  .post(verifyUserAccessToken, createArticleValidator, createArticle);

module.exports = { ArticlesRouter };
