const pool = require('../configs/db-config');

const ArticleModel = class {
  /**
   *
   * @description Create new article
   * @typedef args List of article details
   * @type {Array}
   * @param {Number} article_id Article ID
   * @param {String} comment Comment content
   * @param {Number} auth_id Author ID
   */
  static async createComment(...args) {
    const queryString = `WITH newComment AS (
      INSERT INTO article_comments("comment", article_id, auth_id)
      VALUES ($2, $1, $3) RETURNING *
    ) SELECT newComment.*, title, article
    FROM newComment
    INNER JOIN articles ON newComment.article_id=articles._id;`;
    try {
      const newArticle = await pool.query(queryString, args);
      return Promise.resolve(newArticle.rows[0]);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   *
   * @description Update comment
   * @typedef args List of article details
   * @type {Array}
   * @param {Number} _id Comment ID
   * @param {String} comment Comment content
   * @param {Number} auth_id Author ID
   */
  static async updateComment(...args) {
    const queryString = `WITH newComment AS (
      UPDATE article_comments SET comment=$2
      WHERE _id=$1 AND auth_id=$3 AND article_id=$4 RETURNING *
    ) SELECT newComment.*, title, article
    FROM newComment
    INNER JOIN articles ON newComment.article_id=articles._id;`;
    try {
      const newArticle = await pool.query(queryString, args);
      if (newArticle.rowCount === 0) {
        const newErr = new Error('Article not found');
        newErr.code = 'ENULL';
        throw newErr;
      }
      return Promise.resolve(newArticle.rows[0]);
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
  }

  /**
   *
   * @description Delete comment
   * @typedef args List of article details
   * @type {Array}
   * @param {Number} _id Comment ID
   * @param {Number} auth_id Employee's ID
   */
  static async deleteComment(...args) {
    const queryString = `DELETE FROM article_comments
    WHERE _id=$1 AND auth_id=$2 AND article_id=$3 RETURNING _id;`;
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
