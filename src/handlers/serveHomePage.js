const fs = require('fs');

const tagWithId = (tag, id, value) => {
  return `<${tag} id="${id}">${value}</${tag}>`;
};

const tagWithClass = (tag, classname, value) => {
  return `<${tag} class="${classname}">${value}</${tag}>`;
};

const createTag = (tag, value) => {
  return `<${tag}>${value}</${tag}>`;
};

const getFilename = (users, name) => {
  const { filename } = users.find(({ username }) => username === name);
  return filename;
};

const createLists = todos => {
  let list = '';
  todos.forEach(({ title, time }) => {
    const titleSpan = createTag('span', title);
    const timeText = `( Last modified : ${time} )`
    const dateSpan = tagWithId('span', 'date', timeText);

    list += tagWithClass('li', 'list', titleSpan + dateSpan);
  });
  const ulTag = createTag('ul', list);
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
  const { todos } = JSON.parse(fs.readFileSync(dir + databaseFile, 'utf-8'));
  serveHomePage(req, res, username, template, todos);
  return;
};

module.exports = { homePageRouter };
