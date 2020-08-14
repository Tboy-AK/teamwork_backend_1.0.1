const { header, param } = require('express-validator');

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
];

module.exports = validators;
