const { todo } = require('./src/todo.js');

const startServer = (port, config) => {
  const app = todo(config);
  app.listen(port, () => console.log(`Listening on the port ${port}`));
};

const PORT = 5678;
const config = {
  dir: 'src/database/',
  path: 'public',
  env: 'production',
  userDetails: 'userDetails.json',
  signUpPage: 'templates/signup.txt',
  loginPage: 'templates/login.txt',
  homeTemplate: 'templates/homeTemplate.txt',
  viewTemplate: 'templates/viewTemplate.txt'
};

startServer(PORT, config);
