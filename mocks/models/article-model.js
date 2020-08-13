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
      newErr.code = '23503';
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
  updateArticle: (...args) => {
    if (!db.auths.find(({ _id }) => _id === args[3])) {
      const newErr = new Error('Related data does not exist');
      newErr.code = '23503';
      throw newErr;
    }

    const articleData = {
      _id: args[0],
      title: args[1],
      article: args[2],
      auth_id: args[3],
    };

    const requestedArticleList = db.articles
      .filter(({ _id }) => _id === articleData._id);

    if (!requestedArticleList || requestedArticleList.length === 0) {
      const newErr = new Error('Article not found');
      newErr.code = 'ENULL';
      throw newErr;
    }

    db.articles.fill((() => {
      const [requestedArticle] = requestedArticleList;
      requestedArticle.title = articleData.title;
      requestedArticle.article = articleData.article;
      requestedArticle.modified_at = new Date().toLocaleDateString();
      return requestedArticle;
    })(), articleData._id, articleData._id + 1);

    return db.articles.find(({ _id }) => _id === articleData._id);
  },
  deleteArticle: (...args) => {
    if (!db.auths.find(({ _id }) => _id === args[1])) {
      const newErr = new Error('Related data does not exist');
      newErr.code = 'ENULL';
      throw newErr;
    }

    const articleData = {
      _id: args[0],
      auth_id: args[1],
    };

    const requestedArticleList = db.articles
      .filter(({ _id }) => _id === articleData._id);

    if (!requestedArticleList || requestedArticleList.length === 0) {
      const newErr = new Error('Article not found');
      newErr.code = 'ENULL';
      throw newErr;
    }

    return db.articles.splice(articleData._id, 1);
  },
};

module.exports = ArticleModel;
