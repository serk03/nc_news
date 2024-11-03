const db = require("../db/connection");

function fetchTopics() {
  return db.query("SELECT slug, description FROM topics").then((response) => {
    return response.rows;
  });
}

function fetchArticleById(id) {
  const queryString = `
    SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
  `;
  
  return db.query(queryString, [id])
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

function fetchAllArticles(sortBy = "created_at", order = "ASC", topic){
 
    const queryValues= [];
    let queryString = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id):: INT AS comment_count
    FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `
    if(topic){
      queryValues.push(topic);
      queryString+=` WHERE topic = $1`
    }
    queryString+=` GROUP BY articles.article_id
    ORDER BY ${sortBy} ${order}
  `
  return db.query(queryString, queryValues)
  .then(({rows})=>{
    if (rows.length===0) {
        return Promise.reject({
          status: 200,
          msg:`article not found`,
        });
  }
    return rows;
  });
}

function fetchArticleComments(id){
 //get comment_id, votes, created_at, author, body, article_id

  //bind comments to article by article_id
  //should return most recent comments first.
  // join articles and comment table.

    const queryString = `
    SELECT *  FROM comments
    WHERE article_id =$1
    ORDER BY created_at DESC
    `
  return db.query(queryString,[id]).then(({rows})=>{
     return rows;
  })
  }


  function postArticleComments(id, newItem){
    const queryString = `
    INSERT INTO comments
    (body, author, article_id )
    VALUES($1,$2,$3)
    RETURNING *
    `
    return db.query(queryString,[newItem.body,newItem.username,id])
    .then(({rows})=>{
      return rows;
    })

  }

  function patchArticleById(id, newArticle){
    const queryString = `
    UPDATE articles
    SET
    votes = votes+ $2
    WHERE article_id = $1
    RETURNING *;
    `
    return db.query(queryString,[id, newArticle.inc_votes])
    .then(({rows})=>{
        return rows[0];
    })
  }
 function deleteComment(commentId){
    const queryString = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;
    `
    // const queryString = `
    //   SELECT FROM comments
    //   WHERE comment_id = $1
    // `

    return db.query(queryString,[commentId])
    .then((response)=>{
      // console.log(response, commentId);
      const rowCount = response.rowCount;
      if(rowCount===0){
        return Promise.reject({status:404, msg: "article not found"});
      }
     
    })
  }
  
  function fetchAllUsers() {
  return db.query("SELECT * FROM users").then((response) => {
    return response.rows;
  });
}

module.exports = { fetchTopics, fetchArticleById, fetchAllArticles, fetchArticleComments, postArticleComments,patchArticleById, deleteComment, fetchAllUsers };


