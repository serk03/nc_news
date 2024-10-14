const { fetchTopics } = require("./model");

function getTopics(request, response) {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
}

module.exports = { getTopics };
