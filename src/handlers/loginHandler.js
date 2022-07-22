const getFilename = (users, name) => {
  const { filename } = users.find(({ username }) => username === name);
  return filename;
};

const isRegistered = (loginName, loginPass, users) => {
  return users.find(({ username, password }) => {
    return username === loginName && password === loginPass;
  });
};

const validateUser = (users, dir) => (req, res) => {
  const { username, password } = req.body;
  if (!isRegistered(username, password, users)) {
    res.redirect(302, '/loginWithErr.html');
    return;
  }
  const databaseFile = getFilename(users, username);
  req.session.username = username;
  req.session.databaseFile = dir + databaseFile;
  res.redirect(302, '/home-page');
  return;
};

module.exports = { validateUser };