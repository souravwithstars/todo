const fs = require('fs');

const getMatchedLists = ({ todos }, searchText) => {
  return todos.filter(({ items }) => {
    return items.find(({ item }) => item.toLowerCase().includes(searchText));
  }).filter(({ deleted }) => !deleted);
};

const searchItemHandler = (req, res) => {
  const { searchText } = req.params;
  const { databaseFile } = req.session;
  const details = JSON.parse(fs.readFileSync(databaseFile, 'utf-8'));
  let matchedLists = details.todos.filter(({ deleted }) => !deleted);
  if (searchText !== 'all') {
    matchedLists = getMatchedLists(details, searchText);
  }
  res.json(matchedLists);
  return;
};

module.exports = { searchItemHandler };
