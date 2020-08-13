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
  body('title')
    .optional({ nullable: true })
    .trim(' ')
    .matches(/^(?=.*[0-9a-zA-Z]).{1,}$/)
    .withMessage('Title must have content when used')
    .escape(),
  body('article')
    .trim(' ')
    .matches(/^(?=.*[0-9a-zA-Z]).{1,}$/)
    .withMessage('Article must have content')
    .escape(),
];

module.exports = validators;
