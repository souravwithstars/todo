const fs = require('fs');

const createFileName = (username, ext) => {
  const filename = username.split(' ').join('').toLowerCase();
  return filename + '.json';
};

const createFile = ({ username, password, filename }, dir) => {
  const defaultDetails = { username, password, nextId: 1, todos: [] };
  fs.writeFileSync(dir + filename, JSON.stringify(defaultDetails), 'utf-8');
  return;
};

const registerUser = (users, dir, database) => (req, res) => {
  const { username, password } = req.body;
  if (username === '' || password === '') {
    res.redirect(302, '/signupWithErr.html');
    return;
  }
  req.body.filename = createFileName(username, '.json');
  createFile(req.body, dir);
  users.unshift(req.body);
  fs.writeFileSync(database, JSON.stringify(users), 'utf-8');
  res.redirect(302, '/login.html');
  return;
};

module.exports = { registerUser };
