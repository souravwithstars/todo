const fs = require('fs');
const express = require('express');
const logRequest = require('morgan');
const cookieSession = require('cookie-session');
const { notFoundHandler } = require('server');
const { registerUser } = require('./handlers/signupHandler.js');
const { validateUser } = require('./handlers/loginHandler.js');
const { logoutHandler } = require('./handlers/logoutHandler.js');
const { homePageRouter } = require('./handlers/serveHomePage.js');
const { addListHandler } = require('./handlers/addListHandler.js');
const { viewPageRouter } = require('./handlers/serveViewPage.js');
const { deleteListHandler } = require('./handlers/deleteListHandler.js');
const { addItemHandler } = require('./handlers/addItemHandler.js');
const { markItemHandler } = require('./handlers/markItemHandler.js');
const { deleteItemHandler } = require('./handlers/deleteItemHandler.js');

const keys = JSON.parse(fs.readFileSync('./src/secretKeys.json', 'utf-8'));

const todo = ({ dir, path, userDetails, homeTemplate, viewTemplate }) => {
  const filename = dir + userDetails;
  const users = JSON.parse(fs.readFileSync(filename, 'utf-8'));
  const homePage = fs.readFileSync(path + homeTemplate, 'utf-8');
  const viewPage = fs.readFileSync(path + viewTemplate, 'utf-8');

  const app = express();
  const listRouter = express.Router();
  const itemRouter = express.Router();

  app.use(express.urlencoded({ extended: true }));
  app.use(logRequest('tiny'));
  app.use(cookieSession({ name: 'session', keys }));

  app.post('/register-user', registerUser(users, dir, filename));
  app.post('/logged-user', validateUser(users, dir));
  app.get('/logout', logoutHandler);

  app.get('/home-page', homePageRouter(homePage));
  app.post('/add-list', addListHandler);

  app.use('/list', listRouter);
  listRouter.get('/:listId/view', viewPageRouter(viewPage));
  listRouter.post('/:listId/delete', deleteListHandler);

  app.post('/add-item', addItemHandler);

  app.use('/item', itemRouter);
  itemRouter.post('/:title/:itemId/mark', markItemHandler);
  itemRouter.post('/:title/:itemId/delete', deleteItemHandler);

  app.use(express.static('public'));
  app.use(notFoundHandler);
  return app;
};

module.exports = { todo };
