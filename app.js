const express = require('express');
const { getTopics } = require('./controllers/topics.controller.js');

const app = express();

app.get('/api/topics', getTopics);

module.exports = app;