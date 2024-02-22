const articlesRouter = require('express').Router();
const { getArticles, postArticle, getArticleByID, patchArticleByID, deleteArticleByID } = require('../controllers/articles.controller.js');

articlesRouter.get('/', getArticles);
articlesRouter.post('/', postArticle);

articlesRouter.get('/:article_id', getArticleByID);
articlesRouter.patch('/:article_id', patchArticleByID);
articlesRouter.delete('/:article_id', deleteArticleByID);

module.exports = articlesRouter;