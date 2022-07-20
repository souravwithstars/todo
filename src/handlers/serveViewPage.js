const fs = require('fs');

const getTodo = (todos, reqId) => {
  const todo = todos.find(({ id }) => id === reqId);
  return todo;
};

const tagWithClassAndId = (tag, classname, id, value) => {
  return `<${tag} class="${classname}" id="${id}">${value}</${tag}>`;
};

const createTag = (tag, value) => {
  return `<${tag}>${value}</${tag}>`;
};

const createCheckBox = (status, id) => {
  return `<input type="checkbox" value="${status}" id="${id}">`;
};

const createDeleteEmoji = (id) => {
  return `<span><img src="../resources/delete.png" onclick="deleteItem()"></span>`;
};

const replaceTemplates = (template, username, title, listsHtml) => {
  const withTitle = template.replace('__TITLE__', title);
  const withUsername = withTitle.replace('__USERNAME__', username);
  const content = withUsername.replace('__ITEMS__', listsHtml);
  return content;
};

const createLists = items => {
  let lists = '';
  items.forEach(({ item, id, done, deleted }) => {
    const checkBox = createCheckBox(done, id);
    const titleSpan = createTag('span', item);
    const deleteSpan = createDeleteEmoji(id);

    const listInner = checkBox + titleSpan + deleteSpan;
    lists += tagWithClassAndId('li', 'list', id, listInner);
  });
  const ulTag = createTag('ul', lists);
  return ulTag;
};

const serveViewPage = (req, res, username, template, todo) => {
  const { title, items } = todo;
  const listsHtml = createLists(items);
  const content = replaceTemplates(template, username, title, listsHtml);

  res.set('Content-type', 'text/html');
  res.set('Content-length', content.length);
  res.end(content);
  return true;
}

const viewPageRouter = (users, viewPage) => (req, res) => {
  const { id } = req.params;
  const { username, databaseFile } = req.session;
  if (!username) {
    res.redirect(302, '/login.html');
    return;
  }
  const { todos } = JSON.parse(fs.readFileSync(databaseFile, 'utf-8'));
  const todo = getTodo(todos, +id);
  serveViewPage(req, res, username, viewPage, todo);
  return;
};

module.exports = { viewPageRouter };
