const fs = require('fs');

const tagWithClassAndId = (tag, classname, id, value) => {
  return `<${tag} class="${classname}" id="${id}">${value}</${tag}>`;
};

const createEmoji = (classname, id, emojiName, onclick) => {
  return `<span class="${classname}"><i class="material-icons" id="${id}" onclick="${onclick}">${emojiName}</i></span>`;
};

const createCheckBox = (status, id, classname) => {
  const checked = status ? 'checked' : '';
  return `<input type="checkbox" ${checked} class="${classname}" id="${id}" onclick="markItem(event)">`;
};

const createTagWithClass = (tag, value, classname) => {
  return `<${tag} class="${classname}">${value}</${tag}>`;
};

const createItems = items => {
  let lists = '';
  items.forEach(({ item, id, done, deleted }) => {
    if (!deleted) {
      const checkBox = createCheckBox(done, id, 'checkbox');
      const titleSpan = createTagWithClass('span', item, 'item-title');
      const itemClass = tagWithClassAndId('div', '', 'item', checkBox + titleSpan);
      const editSpan = createEmoji('edit', id, 'edit', 'openEditPopup(event)');
      const deleteSpan = createEmoji('delete', id, 'delete_forever', 'deleteItem(event)');

      const listInner = itemClass + editSpan + deleteSpan;
      lists += tagWithClassAndId('li', 'item', id, listInner);
    }
  })
  const ulTag = createTagWithClass('ul', lists,);
  return ulTag;
};

const createLists = todos => {
  let lists = '';
  todos.forEach(({ title, items, deleted }) => {
    if (!deleted) {
      const titleSpan = createTagWithClass('div', `<p>${title}</p>`, 'list-title');
      const itemsHtml = createItems(items);
      const ulTag = createTagWithClass('ul', itemsHtml, 'items');
      const newList = createTagWithClass('li', titleSpan + ulTag, 'list');
      lists += newList;
    }
  })
  const ulTag = createTagWithClass('ul', lists, '');
  return ulTag;
};

const replaceTemplates = (template, username, listsHtml) => {
  const withUsername = template.replace('__USERNAME__', username);
  const content = withUsername.replace('__ITEMS__', listsHtml);
  return content;
};

const serveSearchPage = (req, res, username, template, todos) => {
  const listsHtml = createLists(todos);
  const content = replaceTemplates(template, username, listsHtml);

  res.set('Content-type', 'text/html');
  res.set('Content-length', content.length);
  res.end(content);
  return true;
};

const searchPageHandler = searchPage => (req, res) => {
  const { username, databaseFile } = req.session;
  if (!username) {
    res.redirect(302, '/');
    return;
  }
  const { todos } = JSON.parse(fs.readFileSync(databaseFile, 'utf-8'));
  serveSearchPage(req, res, username, searchPage, todos);
  return;
};

module.exports = { searchPageHandler };
