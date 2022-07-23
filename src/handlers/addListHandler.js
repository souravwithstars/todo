const fs = require('fs');

const createDate = () => {
  const time = new Date();
  const date = time.getDate();
  let month = time.getMonth() + 1;
  if (month > 12) {
    month = month - 12;
  }
  month = ('' + month).padStart(2, 0);
  const year = time.getFullYear();
  return `${date}/${month}/${year}`;
};

const createList = (title, id) => {
  const items = [];
  const date = createDate();
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

module.exports = { createDate, addListHandler };
