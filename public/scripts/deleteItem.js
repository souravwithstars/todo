const deleteItemFromPage = id => {
  const li = document.getElementById(id);
  li.remove();
  return;
};

const sendDeleteRequest = xhrRequest => {
  const { method, pathname } = xhrRequest;
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const { id } = JSON.parse(xhr.response);
    deleteItemFromPage(id);
    return;
  };
  xhr.open(method, pathname);
  xhr.send();
  return;
};

const deleteItem = event => {
  const itemId = event.srcElement.id;
  const titleElement = document.getElementById('title');
  const title = titleElement.innerText.slice(0, -2);
  const xhrRequest = { method: 'post', pathname: `/item/${title}/${itemId}/delete` };
  sendDeleteRequest(xhrRequest);
  return;
};