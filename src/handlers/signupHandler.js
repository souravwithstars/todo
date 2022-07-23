const fs = require('fs');

const serveSignUpPage = signUpPage => (req, res) => {
  const content = fs.readFileSync(signUpPage, 'utf-8');
  res.end(content);
  return true;
};

const createFile = ({ username, password, filename }, dir) => {
  const defaultDetails = { username, password, nextId: 1, todos: [] };
  fs.writeFileSync(dir + filename, JSON.stringify(defaultDetails), 'utf-8');
  return;
};

const invalidCredentials = (username, password) => {
  return username === '' || password === '';
};

const usernameExists = (users, enteredName) => {
  return users.some(({ username }) => username === enteredName);
};

const usernameWithSpace = username => {
  return username.split(' ').length > 1;
};

const registerUser = (users, dir, database) => (req, res) => {
  const { username, password } = req.body;
  if (invalidCredentials(username, password)) {
    const message = 'Please Provide Both Username and Password!!!';
    res.cookie('error', message, { maxAge: 5000 });
    res.redirect(302, '/signup');
    return;
  }
  if (usernameExists(users, username)) {
    const message = 'Please Try with Another Username!!!';
    res.cookie('error', message, { maxAge: 5000 });
    res.redirect(302, '/signup');
    return;
  }
  if (usernameWithSpace(username)) {
    const message = 'Username cannot consist of spaces!!!';
    res.cookie('error', message, { maxAge: 5000 });
    res.redirect(302, '/signup');
    return;
  }
  req.body.filename = username + '.json';
  createFile(req.body, dir);
  users.unshift(req.body);
  fs.writeFileSync(database, JSON.stringify(users), 'utf-8');

  req.session.username = username;
  req.session.databaseFile = dir + req.body.filename;
  res.redirect(302, '/home-page');
  return;
};

module.exports = { serveSignUpPage, registerUser };
