/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const db = require('../db.json');

const ArticleModel = {
  findById: (articleId) => {
    const usersWithId = db.articles.find(({ email }) => email === articleId);
    if (usersWithId) return usersWithId;
    throw new Error('Data does not exist');
  },
  createArticle: (...args) => {
    if (!db.auths.find(({ _id }) => _id === args[2])) {
      const newErr = new Error('Related data does not exist');
      newErr.code = '23000';
      throw newErr;
    }

    const articleData = {
      _id: db.articles.length + 1,
      title: args[0],
      article: args[1],
      auth_id: args[2],
      created_at: new Date().toLocaleDateString(),
    };
    db.articles.push(articleData);

    return db.articles[db.articles.length - 1];
  },
};

module.exports = ArticleModel;
