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

const openEditPopup = (event) => {
  const itemId = event.srcElement.id;
  const element = event.target;
  const ul = element.closest('ul');
  const title = ul.getAttribute('list-name');

  const editItem = createEditItem(itemId, title);

  const button = document.getElementById('edit');
  button.addEventListener('click', editItem);
  const form = document.getElementById('edit-item');
  form.addEventListener('submit', editItem);

  const popup = document.getElementById('edit-popup');
  popup.style.visibility = 'visible';
  openPopup();
  return;
};

const closeEditPopup = () => {
  const popup = document.getElementById('edit-popup');
  popup.style.visibility = 'hidden';
  closePopup();
  return;
};

const editItemName = (title, item, id) => {
  const itemSpan = document.querySelector(`ul[list-name="${title}"] span`);
  itemSpan.innerText = item;
  return;
};

const sendEditRequest = (xhrRequest, title) => {
  const { method, pathname, body } = xhrRequest;
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const { item, id } = JSON.parse(xhr.response);
    editItemName(title, item, id);
    return;
  };
  xhr.open(method, pathname);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send(body);
  closeEditPopup();
  return;
};

const createEditItem = (itemId, title) => event => {
  console.log(itemId, title);
  event.preventDefault();
  const xhrRequest = { method: 'post', pathname: `/item/${title}/${itemId}/edit` };
  const form = document.getElementById('edit-item');
  const formData = new FormData(form);
  const parsedForm = new URLSearchParams(formData).toString();
  xhrRequest.body = parsedForm;
  sendEditRequest(xhrRequest, title);
  form.reset();
  return;
};