const fs = require('fs');

const createList = title => {
  const items = [];
  const time = new Date().toLocaleString();
  return { title, items, time };
};

const addItemHandler = (users, dir) => (req, res) => {
  const { databaseFile } = req.session;
  const details = JSON.parse(fs.readFileSync(databaseFile));
  const { todos } = details;
  const { title } = req.body;
  const newList = createList(title);
  todos.unshift(newList);
  fs.writeFileSync(databaseFile, JSON.stringify(details), 'utf-8');
  res.json(newList);
  return;
};

module.exports = { addItemHandler };
