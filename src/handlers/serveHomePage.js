const fs = require('fs');

const tagWithId = (tag, id, value) => {
  return `<${tag} id="${id}">${value}</${tag}>`;
};

const tagWithClassAndId = (tag, classname, id, value) => {
  return `<${tag} class="${classname}" id="${id}">${value}</${tag}>`;
};

const createTagWithClass = (tag, value, classname) => {
  return `<${tag} class="${classname}">${value}</${tag}>`;
};

const createLink = (value, hrefFile) => {
  return `<a href="${hrefFile}">${value}</a>`;
};

const createEmoji = (classname, id, emojiName, onclick) => {
  return `<span class="${classname}"><i class="material-icons" id="${id}" onclick="${onclick}">${emojiName}</i></span>`;
};

const createLists = todos => {
  let lists = '';
  todos.forEach(({ title, date, id, deleted }) => {
    if (!deleted) {
      const hrefFile = `list/${id}/view`;
      const titleSpan = createTagWithClass('span', title, 'list-title');
      const dateText = `( Last modified : ${date} )`;
      const dateSpan = tagWithId('span', 'date', dateText);
      const link = createLink(titleSpan + dateSpan, hrefFile);

      const editSpan = createEmoji('edit', id, 'edit', 'openEditPopup(event)');
      const deleteSpan = createEmoji('delete', id, 'delete_forever', 'deleteList(event)');
      const newList = tagWithClassAndId('li', 'list', id, link + editSpan + deleteSpan);

      lists += newList;
    }
  });
  const ulTag = createTagWithClass('ul', lists, '');
  return ulTag;
};

const serveHomePage = (req, res, username, template, todos) => {
  const listsHtml = createLists(todos);
  const content = template.replace('__USERNAME__', username);
  const contentWithLists = content.replace('__LISTS__', listsHtml);

  res.set('Content-type', 'text/html');
  res.set('Content-length', contentWithLists.length);
  res.end(contentWithLists);
  return true;
};

const homePageRouter = template => (req, res) => {
  const { username, databaseFile } = req.session;
  if (!username) {
    res.redirect(302, '/');
    return;
  }
  const { todos } = JSON.parse(fs.readFileSync(databaseFile, 'utf-8'));
  serveHomePage(req, res, username, template, todos);
  return;
};

module.exports = { homePageRouter };
