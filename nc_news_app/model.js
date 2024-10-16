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
    });
}

function fetchAllArticles(){
  //get author, title, article_id, topic, created_at, votes, article_img_url, comment_count
  //bind comment by to article by article_id
  //count (how many comments there are) by counting comment_id
  // join articles and comment table.

  const queryString = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id):: INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id
  `
  return db.query(queryString)
  .then(({rows})=>{
    return rows;
  })
}


module.exports = { fetchTopics, fetchArticles, fetchAllArticles };
