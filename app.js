const express = require('express');
const { getAPIEndpoints } = require('./controllers/api.controller.js');
const { getTopics } = require('./controllers/topics.controller.js');
const { handleServerErrors } = require('./errors');

const app = express();

// API Endpoints
app.get('/api', getAPIEndpoints);

// Topics
app.get('/api/topics', getTopics);

// Error Handling
app.use(handleServerErrors);

module.exports = app;