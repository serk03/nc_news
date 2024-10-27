const express = require("express");
const app = express();
const endpoints = require("../endpoints.json");

const { getTopics, getArticleById, getAllArticles, getArticleComments, addArticleComments,updateArticleByArticleId, deleteCommentByCommentId } = require("../nc_news_app/controller");

app.use(express.json())

app.get("/api/topics", getTopics);

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints });
});

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments",getArticleComments);

app.post("/api/articles/:article_id/comments",addArticleComments);

app.patch("/api/articles/:article_id", updateArticleByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  }else if (err.code === "23503"){
    res.status(404).send({ msg: "username not found" });
  }else if(err.code === "23502"){
     res.status(400).send({ msg: "Bad Request" });
  }
   else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    console.log(err);
    response.status(500).send({ msg: "Internal Server Error" });
  }
});




module.exports = app;
