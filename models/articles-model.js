const pool = require('../configs/db-config');

const ArticleModel = class {
  /**
   *
   * @description Create new article
   * @typedef args List of article details
   * @type {Array}
   * @param {String} title Employee's email
   * @param {String} article Employee's hashed password
   * @param {String} auth_id Employee's first name
   */
  static async createArticle(...args) {
    const queryString = `INSERT INTO articles(title, article, auth_id)
    VALUES ($1, $2, $3) RETURNING *;`;
    try {
      const newArticle = await pool.query(queryString, args);
      return Promise.resolve(newArticle.rows[0]);
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

module.exports = ArticleModel;
