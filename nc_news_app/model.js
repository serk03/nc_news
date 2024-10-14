const db = require("../db/connection");

function fetchTopics() {
  return db.query("SELECT slug, description FROM topics").then((response) => {
    return response.rows;
  });
}

module.exports = { fetchTopics };
