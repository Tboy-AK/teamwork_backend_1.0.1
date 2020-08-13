const express = require('express');
const ArticleCommentModel = require('../models/article-comments-model');
const { createComment, updateComment, deleteComment } = require('../controllers/article-comments-controller')(ArticleCommentModel);
const createArticleCommentValidator = require('../middleware/validators/user-create-article-comment-validator');
const updateArticleCommentValidator = require('../middleware/validators/user-update-article-comment-validator');
const deleteArticleCommentValidator = require('../middleware/validators/user-delete-article-comment-validator');
const { verifyUserAccessToken } = require('../middleware/token-verifier');

const ArticleCommentsRouter = express.Router();

ArticleCommentsRouter
  .route('/articles/:articleId/comments')
  .post(verifyUserAccessToken, createArticleCommentValidator, createComment);

ArticleCommentsRouter
  .route('/articles/:articleId/comments/:commentId')
  .put(verifyUserAccessToken, updateArticleCommentValidator, updateComment)
  .delete(verifyUserAccessToken, deleteArticleCommentValidator, deleteComment);

module.exports = { ArticleCommentsRouter };
