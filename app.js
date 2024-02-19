const express = require('express');
const { getTopics } = require('./controllers/topics.controller.js');
const { handleServerErrors } = require('./errors');

const app = express();

// Topics
app.get('/api/topics', getTopics);

// Error Handling
app.use(handleServerErrors);

module.exports = app;