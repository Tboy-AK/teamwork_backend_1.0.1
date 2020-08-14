const { body, header, param } = require('express-validator');

const validators = [
  header('Authorization')
    .trim(' ')
    .notEmpty()
    .withMessage('No token present')
    .isJWT()
    .withMessage('Invalid token type'),
  param('articleId')
    .trim(' ')
    .notEmpty()
    .withMessage('Article ID must be supplied')
    .isInt()
    .withMessage('Article ID must be a number'),
  param('commentId')
    .trim(' ')
    .notEmpty()
    .withMessage('Comment ID must be supplied')
    .isInt()
    .withMessage('Comment ID must be a number'),
  body('comment')
    .trim(' ')
    .notEmpty()
    .withMessage('Comment cannot be empty')
    .isLength({ min: 1 })
    .withMessage('Comment must have content')
    .escape(),
];

module.exports = validators;
