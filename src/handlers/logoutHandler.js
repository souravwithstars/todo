const logoutHandler = (req, res) => {
  req.session = null;
  res.redirect(302, '/');
  return;
};

module.exports = { logoutHandler };
