const comments = require("../db/data/test-data/comments");

const { fetchTopics, fetchArticleById, fetchAllArticles, fetchArticleComments,postArticleComments,patchArticleById, deleteComment, fetchAllUsers } = require("./model");


function getTopics(request, response) {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
}

function getArticleById(request, response, next) {
  const article_id = request.params.article_id;
  fetchArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function getAllArticles(request, response, next){
  const sortBy = request.query.sort_by;
  const order = request.query.order;
  const topic = request.query.topic; 
  // console.log(topic); 
  fetchAllArticles(sortBy, order, topic)
  .then((articles)=>{
    response.status(200).send({articles});
  })
  .catch((err)=>{
    // console.log(err);
    next(err)
  })
}

function getArticleComments(request, response, next){
  const article_id = request.params.article_id;
  fetchArticleById(article_id)
  .then(()=>{
    return fetchArticleComments(article_id)
  })
  .then((comments)=>{
    
    response.status(200).send({comments})
  })
   .catch((err) => {
      next(err);
   });
}

function addArticleComments(request, response, next){
  const newItemId = request.params.article_id;
  const newItem = request.body;
  fetchArticleById(newItemId)
  .then(()=>{
    return postArticleComments(newItemId, newItem)
  })
  .then((comments)=>{
    response.status(200).send({comments})
  })
  .catch((err)=>{
    next(err)
  })
}


function updateArticleByArticleId(request, response, next){
  const articleId = request.params.article_id;
  const newArticle = request.body;
  fetchArticleById(articleId)
  .then(()=>{
    return patchArticleById(articleId, newArticle)
  })
  .then((article)=>{
    response.status(200).send({article})

  })
  .catch((err)=>{
    next(err)
  })
}

function deleteCommentByCommentId(request, response, next){
  const comment_Id = request.params.comment_id;
  deleteComment(comment_Id)
  .then(()=>{
    response.status(204).send()
  })
  .catch((err)=>{
    next(err)
  })
}

function getAllUsers(request, response){
  fetchAllUsers().then((users) => {
    response.status(200).send({ users });
  });
}




module.exports = { getTopics, getArticleById, getAllArticles, getArticleComments,addArticleComments,updateArticleByArticleId, deleteCommentByCommentId, getAllUsers };

