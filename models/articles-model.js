const pool = require('../configs/db-config');

const ArticleModel = class {
  /**
   *
   * @description Create new article
   * @typedef args List of article details
   * @type {Array}
   * @param {String} title Employee's email
   * @param {String} article Employee's hashed password
   * @param {Number} auth_id Employee's first name
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

  /**
   *
   * @description Create new article
   * @typedef args List of article details
   * @type {Array}
   * @param {Number} _id Article's first name
   * @param {String} title Employee's email
   * @param {String} article Employee's hashed password
   * @param {Number} auth_id Employee's first name
   */
  static async updateArticle(...args) {
    const queryString = `UPDATE articles SET title=$2, article=$3
    WHERE _id=$1 AND auth_id=$4 RETURNING *;`;
    try {
      const newArticle = await pool.query(queryString, args);
      if (newArticle.rowCount === 0) {
        const newErr = new Error('Article not found');
        newErr.code = 'ENULL';
        throw newErr;
      }
      return Promise.resolve(newArticle.rows[0]);
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

module.exports = ArticleModel;
