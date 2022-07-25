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

const createTagWithClass = (tag, value, classname) => {
  return `<${tag} class="${classname}">${value}</${tag}>`;
};

const tagWithClassAndId = (tag, classname, id, value) => {
  return `<${tag} class="${classname}" id="${id}">${value}</${tag}>`;
};

const createCheckBox = (id, classname) => {
  return `<input type="checkbox" value="false" class="${classname}" id="${id}" onclick="markItem(event)">`;
};

const createEmoji = (classname, id, emojiName, onclick) => {
  return `<span class="${classname}"><i class="material-icons" id="${id}" onclick="${onclick}">${emojiName}</i></span>`;
};

const createList = (item, id) => {
  const checkBox = createCheckBox(id, 'checkBox');
  const titleSpan = createTagWithClass('span', item, 'item-title');
  const itemClass = tagWithClassAndId('div', '', 'item', checkBox + titleSpan);
  const editSpan = createEmoji('edit', id, 'edit', 'openEditPopup(event');
  const deleteSpan = createEmoji('delete', id, 'delete_forever', 'deleteItem(event)');

  const innerText = itemClass + editSpan + deleteSpan;
  const list = document.createElement('li');
  list.className = 'list';
  list.id = id;
  list.innerHTML = innerText;
  return list;
};

const showItem = (item, id) => {
  const ul = document.querySelector('ul');
  const list = createList(item, id);

  ul.prepend(list);
  return;
};

const sendAddRequest = xhrRequest => {
  const { method, pathname, body } = xhrRequest;
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const { item, id } = JSON.parse(xhr.response);
    showItem(item, id);
    return;
  };
  xhr.open(method, pathname);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send(body);
  closeAddPopup();
  return;
};

const addItem = () => {
  const xhrRequest = { method: 'post', pathname: '/add-item' };
  const form = document.getElementById('add-item');
  const formData = new FormData(form);
  const parsedForm = new URLSearchParams(formData).toString();
  xhrRequest.body = parsedForm;
  sendAddRequest(xhrRequest);
  form.reset();
  return;
}