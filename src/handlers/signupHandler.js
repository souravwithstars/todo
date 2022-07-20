const fs = require('fs');

const registerUser = (users, database) => (req, res) => {
  const { username, password } = req.body;
  if (username === '' || password === '') {
    res.redirect(302, '/signupWithErr.html');
    return;
  }
  req.body.filename = username.toLowerCase() + '.json';
  users.push(req.body);
  fs.writeFileSync(database, JSON.stringify(users), 'utf-8');
  res.redirect(302, '/login.html');
  return;
};

module.exports = { registerUser };
