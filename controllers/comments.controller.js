const { selectCommentsByArticleID } = require("../models/comments.model.js");

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