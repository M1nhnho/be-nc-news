const commentsRouter = require('express').Router();
const { getCommentsByArticleID, postCommentAtArticleID, patchCommentByID, deleteCommentByID } = require('../controllers/comments.controller.js');

commentsRouter.get('/articles/:article_id/comments', getCommentsByArticleID);
commentsRouter.post('/articles/:article_id/comments', postCommentAtArticleID);

commentsRouter.patch('/comments/:comment_id', patchCommentByID);
commentsRouter.delete('/comments/:comment_id', deleteCommentByID);

module.exports = commentsRouter;