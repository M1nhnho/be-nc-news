const { selectArticles, insertArticle, selectArticleByID, updateArticleByID, removeArticleByID } = require("../models/articles.model.js");

exports.getArticles = (request, response, next) =>
{
    const { topic, sort_by, order, limit, p } = request.query;
    selectArticles(topic, sort_by, order, limit, p)
        .then(([articles, total_count]) =>
        {
            response.status(200).send({ articles, total_count });
        })
        .catch(next);
};

exports.postArticle = (request, response, next) =>
{
    insertArticle(request.body)
        .then((article) =>
        {
            response.status(201).send({ article });
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

exports.deleteArticleByID = (request, response, next) =>
{
    const { article_id } = request.params;
    removeArticleByID(article_id)
        .then(() =>
        {
            response.status(204).send();
        })
        .catch(next);
};