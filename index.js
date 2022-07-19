const { todo } = require('./src/todo.js');

const startServer = port => {
  const app = todo();
  app.listen(port, () => console.log(`Listening on the port ${port}`));
};

const PORT = 5678;

startServer(PORT);
