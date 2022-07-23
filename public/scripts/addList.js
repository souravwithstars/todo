const openPopup = () => {
  const main = document.querySelector('main');
  main.style.filter = 'blur(0.5px)';
  const footer = document.querySelector('footer');
  footer.style.filter = 'blur(0.5px)';
  return;
};

const closePopup = () => {
  const main = document.querySelector('main');
  main.style.filter = 'none';
  const footer = document.querySelector('footer');
  footer.style.filter = 'none';
  return;
};

const openAddPopup = () => {
  const popup = document.getElementById('add-popup');
  popup.style.visibility = 'visible';
  openPopup();
  return;
};

const closeAddPopup = () => {
  const popup = document.getElementById('add-popup');
  popup.style.visibility = 'hidden';
  closePopup();
  return;
};

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

const createList = (title, id, date) => {
  const hrefFile = `list/${id}/view`;
  const titleSpan = createTagWithClass('span', title, 'list-title');
  const dateText = `( Last modified : ${date} )`;
  const dateSpan = tagWithId('span', 'date', dateText);
  const link = createLink(titleSpan + dateSpan, hrefFile);

  const editSpan = createEmoji('edit', id, 'edit', 'openEditPopup(event)');
  const deleteSpan = createEmoji('delete', id, 'delete_forever', 'deleteList(event)');
  const list = document.createElement('li');

  list.className = 'list';
  list.id = id;
  list.innerHTML = link + editSpan + deleteSpan;
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
  closeAddPopup();
  return;
};

const addList = event => {
  event.preventDefault();
  const xhrRequest = { method: 'post', pathname: '/add-list' };
  const form = document.getElementById('new-list');
  const formData = new FormData(form);
  const parsedForm = new URLSearchParams(formData).toString();
  xhrRequest.body = parsedForm;
  sendAddRequest(xhrRequest);
  form.reset();
  return;
};