const openPopup = () => {
  const popup = document.getElementById('popup');
  popup.style.visibility = 'visible';
  const main = document.querySelector('main');
  main.style.filter = 'blur(2px)';
  const footer = document.querySelector('footer');
  footer.style.filter = 'blur(2px)';
  return;
};

const closePopup = () => {
  const popup = document.getElementById('popup');
  popup.style.visibility = 'hidden';
  const main = document.querySelector('main');
  main.style.filter = 'none';
  const footer = document.querySelector('footer');
  footer.style.filter = 'none';
  return;
};

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
  return `<span id="delete"><i class="material-icons" id="${id}">delete</i><span>`;
};

const createList = (title, id, date) => {
  const hrefFile = `list/${id}/view`;
  const titleSpan = createTag('span', title);
  const timeText = `( Last modified : ${date} )`;
  const dateSpan = tagWithId('span', 'date', timeText);
  const link = createLink(titleSpan + dateSpan, hrefFile);
  const deleteDiv = createDeleteEmoji(id);
  const list = document.createElement('li');

  list.className = 'list';
  list.id = id;
  list.innerHTML = link + deleteDiv;
  return list;
};

const showItem = (title, id, date) => {
  const ul = document.querySelector('ul');
  const list = createList(title, id, date);

  ul.prepend(list);
  return;
};

const sendAddRequest = xhrRequest => {
  const { method, pathname, body } = xhrRequest;
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const { title, id, date } = JSON.parse(xhr.response);
    showItem(title, id, date);
    return;
  };
  xhr.open(method, pathname);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send(body);
  closePopup(body);
  return;
};

const addList = () => {
  const xhrRequest = { method: 'post', pathname: '/add-list' };
  const form = document.getElementById('new-list');
  const formData = new FormData(form);
  const parsedForm = new URLSearchParams(formData).toString();
  xhrRequest.body = parsedForm;
  sendAddRequest(xhrRequest);
  form.reset();
  return;
};