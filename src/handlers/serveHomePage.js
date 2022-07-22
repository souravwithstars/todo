const fs = require('fs');

const tagWithId = (tag, id, value) => {
  return `<${tag} id="${id}">${value}</${tag}>`;
};

const tagWithClassAndId = (tag, classname, id, value) => {
  return `<${tag} class="${classname}" id="${id}">${value}</${tag}>`;
};

const createTag = (tag, value) => {
  return `<${tag}>${value}</${tag}>`;
};

const createLink = (value, hrefFile) => {
  return `<a href="${hrefFile}">${value}</a>`;
};

const createDeleteEmoji = id => {
  return `<span id="delete"><i class="material-icons" id="${id}" onclick="deleteList(event)">delete_forever</i><span>`;
};

const createLists = todos => {
  let lists = '';
  todos.forEach(({ title, time, id, deleted }) => {
    if (!deleted) {
      const hrefFile = `list/${id}/view`;
      const titleSpan = createTag('span', title);
      const timeText = `( Last modified : ${time} )`;
      const dateSpan = tagWithId('span', 'date', timeText);
      const link = createLink(titleSpan + dateSpan, hrefFile);
      const deleteDiv = createDeleteEmoji(id);
      const newList = tagWithClassAndId('li', 'list', id, link + deleteDiv);

      lists += newList;
    }
  });
  const ulTag = createTag('ul', lists);
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
    res.redirect(302, '/login.html');
    return;
  }
  const { todos } = JSON.parse(fs.readFileSync(databaseFile, 'utf-8'));
  serveHomePage(req, res, username, template, todos);
  return;
};

module.exports = { homePageRouter };
