const { selectTopics, insertTopic } = require("../models/topics.model.js");

exports.getTopics = (request, response, next) =>
{
    selectTopics()
        .then((topics) =>
        {
            response.status(200).send({ topics })
        })
        .catch(next);
};

exports.postTopic = (request, response, next) =>
{
    insertTopic(request.body)
        .then((topic) =>
        {
            response.status(201).send({ topic })
        })
        .catch(next);
};