const fs = require('fs');

const serveLoginPage = loginPage => (req, res) => {
  const content = fs.readFileSync(loginPage, 'utf-8');
  res.end(content);
  return true;
};

const getFilename = (users, name) => {
  const { filename } = users.find(({ username }) => username === name);
  return filename;
};

const validCredentials = (loginName, loginPass, users) => {
  return users.some(({ username, password }) => {
    return username === loginName && password === loginPass;
  });
};

const emptyField = (username, password) => {
  return username === '' || password === '';
};

const validateUser = (users, dir) => (req, res) => {
  const { username, password } = req.body;
  if (emptyField(username, password)) {
    const message = 'Please Provide Both Username and Password!!!';
    res.cookie('error', message, { maxAge: 5000 });
    res.redirect(302, '/');
    return;
  }
  if (!validCredentials(username, password, users)) {
    const message = 'Invalid username and password!!!';
    res.cookie('error', message, { maxAge: 5000 });
    res.redirect(302, '/');
    return;
  }
  const databaseFile = getFilename(users, username);
  req.session.username = username;
  req.session.databaseFile = dir + databaseFile;
  res.redirect(302, '/home-page');
  return;
};

module.exports = { serveLoginPage, validateUser };