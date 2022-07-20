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
  return `<${tag} class="${classname}">${value}</${tag}>`;
};

const createTag = (tag, value) => {
  return `<${tag}>${value}</${tag}>`;
};

const createLink = (title, id, time) => {
  const titleSpan = createTag('span', title);
  const timeText = `( Last modified : ${time} )`;
  const dateSpan = tagWithId('span', 'date', timeText);

  const list = tagWithClassAndId('li', 'list', id, titleSpan + dateSpan);

  const link = document.createElement('a');
  link.href = 'view/' + id;
  link.innerHTML = list;

  return link;
};

const showItem = (title, id, time) => {
  const ul = document.querySelector('ul');
  const link = createLink(title, id, time);

  ul.prepend(link);
  return;
};

const sendRequest = xhrRequest => {
  const { method, pathname, body } = xhrRequest;
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const { title, id, time } = JSON.parse(xhr.response);
    showItem(title, id, time);
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
  sendRequest(xhrRequest);
  form.reset();
  return;
};