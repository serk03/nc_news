const db = require("../db/connection");

function fetchTopics() {
  return db.query("SELECT slug, description FROM topics").then((response) => {
    return response.rows;
  });
}

function fetchArticles(id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [id])
    .then(({ rows }) => {
      const article = rows[0];

      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `article not found`,
        });
      }
      return article;
      // return rows[0];
    });
}

module.exports = { fetchTopics, fetchArticles };
