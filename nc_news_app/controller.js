const comments = require("../db/data/test-data/comments");
const { fetchTopics, fetchArticleById, fetchAllArticles, fetchArticleComments,postArticleComments, patchArticleById } = require("./model");

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
  
  fetchAllArticles()
  .then((articles)=>{
    response.status(200).send({articles});
  })
  .catch((err)=>{
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
    // console.log(err);
    next(err)
  })
}



module.exports = { getTopics, getArticleById, getAllArticles, getArticleComments,addArticleComments,updateArticleByArticleId };
