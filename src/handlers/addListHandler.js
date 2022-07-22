const fs = require('fs');

const createList = (title, id) => {
  const items = [];
  const time = new Date().toLocaleString();
  const date = time.split(',')[0];
  const nextItemId = 1;
  const deleted = false;
  return { title, id, items, nextItemId, date, deleted };
};

const addListHandler = (req, res) => {
  const { databaseFile } = req.session;
  const details = JSON.parse(fs.readFileSync(databaseFile, 'utf-8'));
  const { todos, nextId } = details;
  const { title } = req.body;
  const newList = createList(title, nextId);
  details.nextId = +nextId + 1;
  todos.unshift(newList);
  fs.writeFileSync(databaseFile, JSON.stringify(details), 'utf-8');
  res.json(newList);
  return;
};

module.exports = { addListHandler };
