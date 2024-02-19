const { selectArticleByID, selectArticles } = require("../models/articles.model.js");

exports.getArticles = (request, response, next) =>
{
    selectArticles()
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