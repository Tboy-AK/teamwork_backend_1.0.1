/* eslint-disable no-underscore-dangle */
const { validationResult } = require('express-validator');
const errResHandler = require('../utils/error-response-handler');

const articlesController = (ArticleCommentModel) => {
  const createComment = async (req, res) => {
    // validate user request data
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return errResHandler(res, 422, validationError
        .array({ onlyFirstError: true }).map(({ msg }) => msg));
    }

    // save comment to database
    let newComment;
    try {
      newComment = await ArticleCommentModel.createComment(
        req.params.articleId, req.body.comment, req.userPayload.uid,
      );
    } catch (err) {
      if (err.code === '23000' || err.code === '23503') return errResHandler(res, 403, 'Unauthorized request');
      return errResHandler(res, 500, err.message);
    }

    return res
      .status(201)
      .json({
        message: 'Comment successfully posted',
        commentId: newComment._id,
        comment: newComment.comment,
        articleId: newComment.article_id,
        articleTitle: newComment.title,
        article: newComment.article,
        createdOn: newComment.created_at,
      });
  };

  const updateComment = async (req, res) => {
    // validate user request data
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return errResHandler(res, 422, validationError
        .array({ onlyFirstError: true }).map(({ msg }) => msg));
    }

    // save comment update to database
    let updatedComment;
    const { articleId, commentId } = req.params;
    try {
      updatedComment = await ArticleCommentModel.updateComment(
        commentId, req.body.comment, req.userPayload.uid, articleId,
      );
    } catch (err) {
      if (err.code === '23000' || err.code === '23503') return errResHandler(res, 403, 'Unauthorized request');
      if (err.code === 'ENULL') return errResHandler(res, 406, err.message);
      return errResHandler(res, 500, err.message);
    }

    return res
      .status(201)
      .json({
        message: 'Comment successfully updated',
        commentId: updatedComment._id,
        comment: updatedComment.comment,
        articleId: updatedComment.article_id,
        articleTitle: updatedComment.title,
        article: updatedComment.article,
        createdOn: updatedComment.created_at,
        updatedOn: updatedComment.modified_at,
      });
  };

  const deleteComment = async (req, res) => {
    // validate user request data
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return errResHandler(res, 422, validationError
        .array({ onlyFirstError: true }).map(({ msg }) => msg));
    }

    // delete article from database
    const { articleId, commentId } = req.params;
    try {
      await ArticleCommentModel
        .deleteComment(commentId, req.userPayload.uid, articleId);
      return res.status(200).send('Comment successfully deleted');
    } catch (err) {
      if (err.code === 'ENULL') return errResHandler(res, 403, 'Unauthorized request');
      return errResHandler(res, 500, err.message);
    }
  };

  return { createComment, updateComment, deleteComment };
};

module.exports = articlesController;
