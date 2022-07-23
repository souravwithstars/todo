const openPopup = () => {
  const popup = document.getElementById('popup');
  popup.style.visibility = 'visible';
  const main = document.querySelector('main');
  main.style.filter = 'blur(0.5px)';
  const footer = document.querySelector('footer');
  footer.style.filter = 'blur(0.5px)';
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

const createTag = (tag, value) => {
  return `<${tag}>${value}</${tag}>`;
};

const tagWithClassAndId = (tag, classname, id, value) => {
  return `<${tag} class="${classname}" id="${id}">${value}</${tag}>`;
};

const createCheckBox = (id, classname) => {
  return `<input type="checkbox" value="false" class="${classname}" id="${id}" onclick="markItem(event)">`;
};

const createDeleteEmoji = (id) => {
  return `<span id="delete"><i class="material-icons" id="${id}" onclick= "deleteItem(event)">delete_forever</i></span>`;
};

const createList = (item, id) => {
  const checkBox = createCheckBox(id, 'checkBox');
  const titleSpan = createTag('span', item);
  const itemClass = tagWithClassAndId('div', '', 'item', checkBox + titleSpan);
  const deleteSpan = createDeleteEmoji(id);

  const innerText = itemClass + deleteSpan;
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
  closePopup();
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