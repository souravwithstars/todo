const express = require('express');
const logRequest = require('morgan');
const { notFoundHandler } = require('server');

const todo = () => {
  const app = express();

  app.use(logRequest('tiny'));

  app.use(express.static('public'));
  app.use(notFoundHandler);

  return app;
};

module.exports = { todo };
