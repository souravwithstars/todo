const { todo } = require('./src/todo.js');

const startServer = (port, config) => {
  const app = todo(config);
  app.listen(port, () => console.log(`Listening on the port ${port}`));
};

const PORT = 5678;
const config = {
  dir: 'src/database/',
  path: 'public',
  userDetails: 'userDetails.json',
  homeTemplate: '/resources/homeTemplate.txt',
  viewTemplate: '/resources/viewTemplate.txt'
};

startServer(PORT, config);
