/* eslint-disable no-underscore-dangle */
const db = require('../db.json');

const AuthModel = {
  getOneByEmail: (userEmail) => {
    const usersWithEmail = db.auths.find(({ email }) => email === userEmail);
    if (usersWithEmail) return usersWithEmail;
    const newErr = new Error('Data does not exist');
    newErr.code = 'ENULL';
    throw newErr;
  },
};

module.exports = AuthModel;
