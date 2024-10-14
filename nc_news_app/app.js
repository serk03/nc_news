const express = require("express");
const app = express();
const { getTopics } = require("../nc_news_app/controller");

app.get("/api/topics", getTopics);

module.exports = app;
