const articlesRouter = require('express').Router();
const { getArticles, getArticleByID, patchArticleByID } = require('../controllers/articles.controller.js');

articlesRouter.get('/', getArticles);
articlesRouter.get('/:article_id', getArticleByID);
articlesRouter.patch('/:article_id', patchArticleByID);

module.exports = articlesRouter;