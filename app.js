const express = require('express');
const { handleEndpointErrors, handlePSQLErrors, handleCustomErrors, handleServerErrors } = require('./errors');
const apiRouter = require('./routes/apiRouter.js');

// Server
const app = express();
app.use(express.json());

app.use('/api', apiRouter);

// Error Handling
app.all('/*', handleEndpointErrors);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;