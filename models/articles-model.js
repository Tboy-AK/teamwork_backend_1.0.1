const pool = require('../configs/db-config');

const ArticleModel = class {
  /**
   *
   * @description Create new article
   * @typedef args List of article details
   * @type {Array}
   * @param {String} title Article title
   * @param {String} article Article content
   * @param {Number} auth_id Author's ID
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
   * @description Update article
   * @typedef args List of article details
   * @type {Array}
   * @param {Number} _id Article's first name
   * @param {String} title Article title
   * @param {String} article Article content
   * @param {Number} auth_id Author's ID
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

  /**
   *
   * @description Delete article
   * @typedef args List of article details
   * @type {Array}
   * @param {Number} _id Article's ID
   * @param {Number} auth_id Employee's ID
   */
  static async deleteArticle(...args) {
    const queryString = `DELETE FROM articles
    WHERE _id=$1 AND auth_id=$2 RETURNING _id;`;
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

  /**
   *
   * @description Delete article
   * @typedef args List of article details
   * @type {Array}
   * @param {Number} _id Article's ID
   * @param {Number} auth_id Employee's ID
   */
  static async getArticle(...args) {
    const queryString = `SELECT articles.*, auths.first_name, auths.last_name, (
      SELECT COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            '_id', article_comments._id, 
            'comment', article_comments.comment,
            'created_at', article_comments.created_at,
            'auth_id', article_comments.auth_id,
            'first_name', auths.first_name,
            'last_name', auths.last_name
          ) ORDER BY article_comments.created_at DESC
        ),
        '[]'
      ) FROM article_comments
      INNER JOIN auths ON article_comments.auth_id=auths._id
      WHERE article_comments.article_id = $1
      AND article_comments._id IS NOT NULL
    ) all_comments
    FROM articles
    INNER JOIN auths ON articles.auth_id=auths._id
    WHERE articles._id=$1;`;
    try {
      const foundArticle = await pool.query(queryString, args);
      if (foundArticle.rowCount === 0) {
        const newErr = new Error('Article not found');
        newErr.code = 'ENULL';
        throw newErr;
      }
      return Promise.resolve(foundArticle.rows[0]);
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

module.exports = ArticleModel;
