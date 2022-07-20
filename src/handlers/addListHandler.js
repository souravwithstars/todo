const fs = require('fs');

const createList = (title, id) => {
  const items = [];
  const time = new Date().toLocaleString();
  return { title, id, items, time };
};

const addListHandler = (users, dir) => (req, res) => {
  const { databaseFile } = req.session;
  const details = JSON.parse(fs.readFileSync(databaseFile));
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
