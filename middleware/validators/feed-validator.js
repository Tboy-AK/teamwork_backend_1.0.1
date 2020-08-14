const { header, query } = require('express-validator');

const validators = [
  header('Authorization')
    .trim(' ')
    .notEmpty()
    .withMessage('No token present')
    .isJWT()
    .withMessage('Invalid token type'),
  query('pagination_limit')
    .trim(' ')
    .notEmpty()
    .withMessage('Pagination limit must be supplied')
    .isInt({ gt: 5 })
    .withMessage('Pagination limit must be a number'),
  query('pagination_offset')
    .trim(' ')
    .notEmpty()
    .withMessage('Pagination offset must be supplied')
    .isInt({ gt: -1 })
    .withMessage('Pagination offset must be a number'),
];

module.exports = validators;
