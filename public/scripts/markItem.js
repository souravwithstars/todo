const changeMark = (id, done) => {
  const li = document.getElementById(id);
  const input = li.getElementsByTagName('input')[0];
  input.value = done;
  return;
};

const sendMarkRequest = xhrRequest => {
  const { method, pathname } = xhrRequest;
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const { id, done } = JSON.parse(xhr.response);
    changeMark(id, done);
    return;
  };
  xhr.open(method, pathname);
  xhr.send();
  return;
};

const markItem = event => {
  const itemId = event.srcElement.id;
  const element = event.target;
  const ul = element.closest('ul');
  const title = ul.getAttribute('list-name');

  const xhrRequest = { method: 'post', pathname: `/item/${title}/${itemId}/mark` };
  sendMarkRequest(xhrRequest);
  return;
};