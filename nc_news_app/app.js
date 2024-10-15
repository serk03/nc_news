const express = require("express");
const app = express();
const { getTopics } = require("../nc_news_app/controller");
const endpoints = require("../endpoints.json");

app.get("/api/topics", getTopics);

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints });
});

module.exports = app;
