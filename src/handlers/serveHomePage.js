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

const getFilename = (users, name) => {
  const { filename } = users.find(({ username }) => username === name);
  return filename;
};

const createLink = (newList, hrefFile) => {
  return `<a href="${hrefFile}">${newList}</a>`;
};

const createLists = todos => {
  let lists = '';
  todos.forEach(({ title, time, id }) => {
    const hrefFile = 'view/' + id;
    const titleSpan = createTag('span', title);
    const timeText = `( Last modified : ${time} )`;
    const dateSpan = tagWithId('span', 'date', timeText);

    const newList = tagWithClassAndId('li', 'list', id, titleSpan + dateSpan);
    lists += createLink(newList, hrefFile);
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

const homePageRouter = (users, dir, template) => (req, res) => {
  const { username } = req.session;
  if (!username) {
    res.redirect(302, '/login.html');
    return;
  }
  const databaseFile = getFilename(users, username);
  req.session.databaseFile = dir + databaseFile;
  const { todos } = JSON.parse(fs.readFileSync(dir + databaseFile, 'utf-8'));
  serveHomePage(req, res, username, template, todos);
  return;
};

module.exports = { homePageRouter };
