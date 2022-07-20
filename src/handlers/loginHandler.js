const isRegistered = (loginName, loginPass, users) => {
  return users.find(({ username, password }) => {
    return username === loginName && password === loginPass;
  });
};

const validateUser = users => (req, res) => {
  const { username, password } = req.body;
  if (!isRegistered(username, password, users)) {
    res.redirect(302, '/loginWithErr.html');
    return;
  }
  req.session.username = username;
  res.redirect(302, '/home-page');
  return;
};

module.exports = { validateUser };