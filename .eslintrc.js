/* eslint-disable linebreak-style */
const { platform } = require('os');

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
    node: true,
    jasmine: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'linebreak-style': ['error', platform() === 'linux' ? 'unix' : 'windows'],
  },
};
