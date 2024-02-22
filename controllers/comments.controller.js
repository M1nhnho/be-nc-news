const { selectCommentsByArticleID, insertCommentAtArticleID, updateCommentByID, removeCommentByID } = require("../models/comments.model.js");
const { selectArticleByID } = require("../models/articles.model.js");

exports.getCommentsByArticleID = (request, response, next) =>
{
    const { article_id } = request.params;
    const { limit, p } = request.query;
    selectCommentsByArticleID(article_id, limit, p)
        .then(([comments, total_count]) =>
        {
            response.status(200).send({ comments, total_count });
        })
        .catch(next);
};

exports.postCommentAtArticleID = (request, response, next) =>
{
    const { article_id } = request.params;
    insertCommentAtArticleID(request.body, article_id)
        .then((comment) =>
        {
            response.status(201).send({ comment });
        })
        .catch(next);
};

exports.patchCommentByID = (request, response, next) =>
{
    const { inc_votes } = request.body;
    const { comment_id } = request.params;
    updateCommentByID(inc_votes, comment_id)
        .then((comment) =>
        {
            response.status(200).send({ comment });
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