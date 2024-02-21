const apiRouter = require('express').Router();
const { getAPIEndpoints } = require('../controllers/api.controller');

const topicsRouter = require('./topicsRouter.js');
const articlesRouter = require('./articlesRouter.js');
const commentsRouter = require('./commentsRouter.js');
const usersRouter = require('./usersRouter.js');


apiRouter.get('/', getAPIEndpoints);

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/', commentsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;