const { fetchTopics, fetchArticles } = require("./model");

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

module.exports = { getTopics, getArticles };
