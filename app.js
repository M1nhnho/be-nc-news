const express = require('express');
const { getAPIEndpoints } = require('./controllers/api.controller.js');
const { getTopics } = require('./controllers/topics.controller.js');
const { getArticleByID } = require('./controllers/articles.controller.js');
const { handlePSQLErrors, handleCustomErrors, handleServerErrors } = require('./errors');

const app = express();

// API Endpoints
app.get('/api', getAPIEndpoints);

// Topics
app.get('/api/topics', getTopics);

// Articles
app.get('/api/articles/:article_id', getArticleByID);

// Error Handling
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;