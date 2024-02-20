const { selectCommentsByArticleID, insertCommentAtArticleID, removeCommentByID } = require("../models/comments.model.js");
const { selectArticleByID } = require("../models/articles.model.js");

exports.getCommentsByArticleID = (request, response, next) =>
{
    const { article_id } = request.params;
    selectCommentsByArticleID(article_id)
        .then((comments) =>
        {
            response.status(200).send({ comments });
        })
        .catch(next);
};

exports.postCommentAtArticleID = (request, response, next) =>
{
    const { username, body } = request.body;
    const { article_id } = request.params;
    insertCommentAtArticleID(username, body, article_id)
        .then((comment) =>
        {
            response.status(201).send({ comment });
        })
        .catch(next);
};

exports.deleteCommentByID = (request, response, next) =>
{
    const { comment_id } = request.params;
    removeCommentByID(comment_id)
        .then(() =>
        {
            response.status(204).send();
        })
        .catch(next);
};