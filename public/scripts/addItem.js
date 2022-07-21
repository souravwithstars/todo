const openPopup = () => {
  const popup = document.getElementById('popup');
  popup.style.visibility = 'visible';
  const main = document.querySelector('main');
  main.style.visibility = 'blur(2px)';
  const footer = document.querySelector('footer');
  footer.style.visibility = 'blur(2px)';
  return;
};

const closePopup = () => {
  const popup = document.getElementById('popup');
  popup.style.visibility = 'hidden';
  const main = document.querySelector('main');
  main.style.visibility = 'none';
  const footer = document.querySelector('footer');
  footer.style.visibility = 'none';
  return;
};

const createTag = (tag, value) => {
  return `<${tag}>${value}</${tag}>`;
};

const createCheckBox = (id) => {
  return `<input type="checkbox" value="false" id="${id}" onclick="markItem()">`;
};

const createDeleteEmoji = (id) => {
  return `<span><img src="/resources/delete.png" id="${id}" onclick="deleteItem()"></span>`;
};

const createList = (item, id) => {
  const checkBox = createCheckBox(id);
  const titleSpan = createTag('span', item);
  const deleteSpan = createDeleteEmoji(id);

  const innerText = checkBox + titleSpan + deleteSpan;
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
  closePopup(body);
  return;
};

const addItem = () => {
  const xhrRequest = { method: 'post', pathname: '/add-item' };
  const form = document.getElementById('new-item');
  const formData = new FormData(form);
  const parsedForm = new URLSearchParams(formData).toString();
  xhrRequest.body = parsedForm;
  sendAddRequest(xhrRequest);
  form.reset();
  return;
}