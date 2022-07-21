const fs = require('fs');

const getTodo = ({ todos }, reqId) => {
  return todos.find(({ id }) => id === reqId);
};

const deleteListHandler = (req, res) => {
  const { listId } = req.params;
  const { databaseFile } = req.session;
  const details = JSON.parse(fs.readFileSync(databaseFile, 'utf-8'));

  const todo = getTodo(details, +listId);
  todo.deleted = true;

  fs.writeFileSync(databaseFile, JSON.stringify(details, 'utf-8'));
  res.json(todo);
  return;
};

module.exports = { deleteListHandler };
