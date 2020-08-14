const { body } = require('express-validator');

const validators = [
  body('firstName')
    .trim(' ')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be greater than 2 characters'),
  body('lastName')
    .trim(' ')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be greater than 2 characters'),
  body('email')
    .trim(' ')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Not a valid email')
    .normalizeEmail({ all_lowercase: true }),
  body('password')
    .trim(' ')
    .notEmpty()
    .withMessage('Password is required')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9a-zA-Z]).{8,24}$/)
    .withMessage('Use a strong password')
    .custom((password, { req }) => password === req.body.confirmPassword)
    .withMessage('Passwords must match'),
  body('gender')
    .trim(' ')
    .notEmpty()
    .withMessage('Gender is required')
    .isLength({ min: 4 })
    .withMessage('Gender must be greater than 4 characters'),
  body('department')
    .trim(' ')
    .notEmpty()
    .withMessage('Department is required')
    .isLength({ min: 3 })
    .withMessage('Name must be greater than 2 characters'),
  body('jobRole')
    .trim(' ')
    .notEmpty()
    .withMessage('Job Role is required')
    .isLength({ min: 3 })
    .withMessage('Job Role must be greater than 2 characters'),
  body('address')
    .trim(' ')
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ min: 10 })
    .withMessage('Address must be greater than 9 characters'),
];

module.exports = validators;
