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

const sendRequest = xhrRequest => {
  const { method, pathname, body } = xhrRequest;
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {

  };
  xhr.open(method, pathname);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send(body);
  closePopup(body);
  return;
};

const addItem = () => {
  const xhrRequest = { method: 'post', pathname: '/add-item' };
  const form = dcoument.getElementById('new-list');
  const formData = new FormData(form);
  const parsedForm = new URLSearchParams(formData).toString();
  xhrRequest.body = parsedForm;
  sendRequest(xhrRequest);
  form.reset();
  return;
};