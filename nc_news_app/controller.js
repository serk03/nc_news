const { fetchTopics, fetchArticles, fetchAllArticles } = require("./model");

function getTopics(request, response) {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
}

function getArticles(request, response, next) {
  const article_id = request.params.article_id;
  fetchArticles(article_id)
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
    console.log(err);
    next(err)
  })
}

module.exports = { getTopics, getArticles, getAllArticles };
