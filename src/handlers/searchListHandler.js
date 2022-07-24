const fs = require('fs');

const getMatchedTodos = ({ todos }, searchText) => {
  return todos.filter(({ title }) => title.toLowerCase().includes(searchText));
};

const searchListHandler = (req, res) => {
  const { searchText } = req.params;
  const { databaseFile } = req.session;
  const details = JSON.parse(fs.readFileSync(databaseFile, 'utf-8'));
  if (searchText === 'all') {
    res.json(details.todos);
    return;
  }
  const matchedTodos = getMatchedTodos(details, searchText);
  res.json(matchedTodos);
  return;
};

module.exports = { searchListHandler };
