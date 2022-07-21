const fs = require('fs');

const getTodo = ({ todos }, reqTitle) => {
  return todos.find(({ title }) => title === reqTitle);
};

const getItem = (items, itemId) => {
  return items.find(({ id }) => id === itemId);
};

const deleteItemHandler = (req, res) => {
  const { title, itemId } = req.params;
  const { databaseFile } = req.session;
  const details = JSON.parse(fs.readFileSync(databaseFile, 'utf-8'));

  const todo = getTodo(details, title);
  const item = getItem(todo.items, +itemId);
  item.deleted = true;

  fs.writeFileSync(databaseFile, JSON.stringify(details), 'utf-8');
  res.json(item);
  return;
};

module.exports = { deleteItemHandler };
