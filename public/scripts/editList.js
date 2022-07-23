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

const editTitle = (title, id) => {
  const li = document.getElementById(id);
  const titleSpan = li.getElementsByClassName('list-title')[0];
  titleSpan.innerText = title;
  return;
};

const sendEditRequest = xhrRequest => {
  const { method, pathname, body } = xhrRequest;
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const { title, id } = JSON.parse(xhr.response);
    editTitle(title, id);
    return;
  };
  xhr.open(method, pathname);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send(body);
  closeEditPopup();
  return;
};

const editList = event => {
  event.preventDefault();
  const xhrRequest = { method: 'post', pathname: `/list/${LISTID}/edit` };
  const form = document.getElementById('edit-list');
  const formData = new FormData(form);
  const parsedForm = new URLSearchParams(formData).toString();
  xhrRequest.body = parsedForm;
  sendEditRequest(xhrRequest);
  form.reset();
  return;
};