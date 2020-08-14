const pool = require('../configs/db-config');

const ArticleModel = class {
  static async getFeed(...args) {
    const queryString = `SELECT articles._id, 'article' AS post_type, title, article AS post, articles.created_at,
    auth_id AS "authorId", auths.first_name, auths.last_name, (
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
      AND article_comments._id IS NOT NULL
    ) all_comments
    FROM articles, auths
    WHERE articles.auth_id=auths._id

    UNION ALL

    SELECT gifs._id, 'gif' AS post_type, title, image_url AS post, gifs.created_at,
    auth_id AS "authorId", auths.first_name, auths.last_name, (
      SELECT COALESCE(
      JSON_AGG(
        JSON_BUILD_OBJECT(
        '_id', gif_comments._id, 
        'comment', gif_comments.comment,
        'created_at', gif_comments.created_at,
        'auth_id', gif_comments.auth_id,
        'first_name', auths.first_name,
        'last_name', auths.last_name
        ) ORDER BY gif_comments.created_at DESC
      ),
      '[]'
      ) FROM gif_comments
      INNER JOIN auths ON gif_comments.auth_id=auths._id
      AND gif_comments._id IS NOT NULL
    ) all_comments
    FROM gifs, auths
    WHERE gifs.auth_id=auths._id

    ORDER BY created_at DESC
    LIMIT ${args[0]} OFFSET ${args[1]};`;
    try {
      const foundArticle = await pool.query(queryString);
      if (foundArticle.rowCount === 0) {
        const newErr = new Error('Article not found');
        newErr.code = 'ENULL';
        throw newErr;
      }
      return Promise.resolve(foundArticle.rows);
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

module.exports = ArticleModel;
