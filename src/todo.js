const fs = require('fs');
const express = require('express');
const logRequest = require('morgan');
const cookieSession = require('cookie-session');
const { notFoundHandler } = require('server');
const { registerUser } = require('./handlers/signupHandler.js');
const { validateUser } = require('./handlers/loginHandler.js');
const { homePageRouter } = require('./handlers/serveHomePage.js');
const { addItemHandler } = require('./handlers/addItemhandler.js');

const keys = JSON.parse(fs.readFileSync('./src/secretKey.json', 'utf-8'));

const todo = ({ dir, path, userDetails, homeTemplate }) => {
  const filename = dir + userDetails;
  const users = JSON.parse(fs.readFileSync(filename, 'utf-8'));
  const homePage = fs.readFileSync(path + homeTemplate, 'utf-8');

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(logRequest('tiny'));
  app.use(cookieSession({ name: 'session', keys }));

  app.post('/register-user', registerUser(users, filename));
  app.post('/logged-user', validateUser(users));

  app.get('/home-page', homePageRouter(users, dir, homePage));
  app.post('/add-item', addItemHandler(users, filename));

  app.use(express.static('public'));
  app.use(notFoundHandler);
  return app;
};

module.exports = { todo };
