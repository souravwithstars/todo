const changeMark = (id, done) => {
  const li = document.getElementById('1');
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
  const titleElement = document.getElementById('title');
  const title = titleElement.innerText.slice(0, -2);
  const xhrRequest = { method: 'post', pathname: `/list/${title}/${itemId}/mark` };
  sendMarkRequest(xhrRequest);
  return;
};