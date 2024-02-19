const express = require('express');
const { getAPIEndpoints } = require('./controllers/api.controller.js');
const { getTopics } = require('./controllers/topics.controller.js');
const { getArticleByID, getArticles } = require('./controllers/articles.controller.js');
const { getCommentsByArticleID } = require('./controllers/comments.controller.js');
const { handlePSQLErrors, handleCustomErrors, handleServerErrors } = require('./errors');


const app = express();

// --- ROUTES ---
// API Endpoints
app.get('/api', getAPIEndpoints);

// Topics
app.get('/api/topics', getTopics);

// Articles
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleByID);

// Comments
app.get('/api/articles/:article_id/comments', getCommentsByArticleID);


// --- ERROR HANDLING ---
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;