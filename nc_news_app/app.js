const express = require("express");
const app = express();
const endpoints = require("../endpoints.json");
const { getTopics, getArticles, getAllArticles, getArticleComments } = require("../nc_news_app/controller");

app.get("/api/topics", getTopics);

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints });
});

app.get("/api/articles/:article_id", getArticles);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments",getArticleComments);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    response.status(500).send({ msg: "Internal Server Error" });
  }
});




module.exports = app;
