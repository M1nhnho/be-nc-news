const { selectArticleByID, selectArticles, updateArticleByID } = require("../models/articles.model.js");

exports.getArticles = (request, response, next) =>
{
    const { topic, sort_by, order } = request.query;
    selectArticles(topic, sort_by, order)
        .then((articles) =>
        {
            response.status(200).send({ articles });
        })
        .catch(next);
};

exports.getArticleByID = (request, response, next) =>
{
    const { article_id } = request.params;
    selectArticleByID(article_id)
        .then((article) =>
        {
            response.status(200).send({ article });
        })
        .catch(next);
};

exports.patchArticleByID = (request, response, next) =>
{
    const { inc_votes } = request.body;
    const { article_id } = request.params;
    updateArticleByID(inc_votes, article_id)
        .then((article) =>
        {
            response.status(200).send({ article });
        })
        .catch(next);
};