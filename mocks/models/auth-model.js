/* eslint-disable no-underscore-dangle */
const db = require('../db.json');

const AuthModel = {
  findByEmail: (userEmail) => {
    const usersWithEmail = db.auths.find(({ email }) => email === userEmail);
    if (usersWithEmail) return usersWithEmail;
    throw new Error('Data does not exist');
  },
};

module.exports = AuthModel;
