let LISTID;
const openEditPopup = (event) => {
  LISTID = event.srcElement.id;
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

const editItemName = (item, id) => {
  const li = document.getElementById(id);
  const itemSpan = li.getElementsByClassName('item-title')[0];
  itemSpan.innerText = item;
  return;
};

const sendEditRequest = xhrRequest => {
  const { method, pathname, body } = xhrRequest;
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const { item, id } = JSON.parse(xhr.response);
    editItemName(item, id);
    return;
  };
  xhr.open(method, pathname);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send(body);
  closeEditPopup();
  return;
};

const editItem = event => {
  event.preventDefault();
  const titleElement = document.getElementById('title');
  const title = titleElement.innerText.slice(0, -2);
  const xhrRequest = { method: 'post', pathname: `/item/${title}/${LISTID}/edit` };
  const form = document.getElementById('edit-item');
  const formData = new FormData(form);
  const parsedForm = new URLSearchParams(formData).toString();
  xhrRequest.body = parsedForm;
  sendEditRequest(xhrRequest);
  form.reset();
  return;
};