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

const createCheckBox = (status, id, classname) => {
  const checked = status ? 'checked' : '';
  return `<input type="checkbox" ${checked} class="${classname}" id="${id}" onclick="markItem(event)">`;
};

const createDeleteEmoji = id => {
  return `<span id="delete"><i class="material-icons" id="${id}" onclick="deleteItem(event)">delete_forever</i><span>`;
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
    if (!deleted) {
      const checkBox = createCheckBox(done, id, 'checkbox');
      const titleSpan = createTag('span', item);
      const itemClass = tagWithClassAndId('div', '', 'item', checkBox + titleSpan);
      const deleteSpan = createDeleteEmoji(id);

      const listInner = itemClass + deleteSpan;
      lists += tagWithClassAndId('li', 'list', id, listInner);
    }
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

const viewPageRouter = viewPage => (req, res) => {
  const { listId } = req.params;
  const { username, databaseFile } = req.session;
  if (!username) {
    res.redirect(302, '/login.html');
    return;
  }
  req.session.listId = listId;
  const { todos } = JSON.parse(fs.readFileSync(databaseFile, 'utf-8'));
  const todo = getTodo(todos, +listId);
  serveViewPage(req, res, username, viewPage, todo);
  return;
};

module.exports = { viewPageRouter };
