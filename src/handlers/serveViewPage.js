const fs = require('fs');

const getTodo = (todos, reqId) => {
  const todo = todos.find(({ id }) => id === reqId);
  return todo;
};

const tagWithClassAndId = (tag, classname, id, value) => {
  return `<${tag} class="${classname}" id="${id}">${value}</${tag}>`;
};

const createTagWithClass = (tag, value, classname) => {
  return `<${tag} class="${classname}">${value}</${tag}>`;
};

const createCheckBox = (status, id, classname) => {
  const checked = status ? 'checked' : '';
  return `<input type="checkbox" ${checked} class="${classname}" id="${id}" onclick="markItem(event)">`;
};

const createEmoji = (classname, id, emojiName, onclick) => {
  return `<span class="${classname}"><i class="material-icons" id="${id}" onclick="${onclick}">${emojiName}</i></span>`;
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
      const titleSpan = createTagWithClass('span', item, 'item-title');
      const itemClass = tagWithClassAndId('div', '', 'item', checkBox + titleSpan);
      const editSpan = createEmoji('edit', id, 'edit_note', 'openEditPopup(event)');
      const deleteSpan = createEmoji('delete', id, 'delete_forever', 'deleteItem(event)');

      const listInner = itemClass + editSpan + deleteSpan;
      lists += tagWithClassAndId('li', 'list', id, listInner);
    }
  });
  const ulTag = createTagWithClass('ul', lists, '');
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
    res.redirect(302, '/');
    return;
  }
  req.session.listId = listId;
  const { todos } = JSON.parse(fs.readFileSync(databaseFile, 'utf-8'));
  const todo = getTodo(todos, +listId);
  serveViewPage(req, res, username, viewPage, todo);
  return;
};

module.exports = { viewPageRouter };
