const logoutHandler = (req, res) => {
  req.session = null;
  res.redirect(302, '/login.html');
  return;
};

module.exports = { logoutHandler };
