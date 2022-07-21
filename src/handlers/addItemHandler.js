const fs = require('fs');

const getTodo = ({ todos }, reqId) => {
  return todos.find(({ id }) => id === reqId);
};

const createList = (item, id) => {
  return { item, id, done: false, deleted: false };
};

const addItemHandler = (req, res) => {
  const { databaseFile, listId } = req.session;
  const details = JSON.parse(fs.readFileSync(databaseFile, 'utf-8'));

  const todo = getTodo(details, +listId);
  const { items, nextItemId } = todo;
  const { name } = req.body;

  const newList = createList(name, nextItemId);
  todo.nextItemId = +nextItemId + 1;
  items.unshift(newList);

  fs.writeFileSync(databaseFile, JSON.stringify(details), 'utf-8');
  res.json(newList);
  return;
};

module.exports = { addItemHandler };