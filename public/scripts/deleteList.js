const deleteListFromPage = id => {
  const li = document.getElementById(id);
  li.remove();
  return;
}

const sendDeleteRequest = xhrRequest => {
  const { method, pathname } = xhrRequest;
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const { id } = JSON.parse(xhr.response);
    deleteListFromPage(id);
    return;
  };
  xhr.open(method, pathname);
  xhr.send();
  return;
};

const deleteList = event => {
  const listId = event.srcElement.id;
  const xhrRequest = { method: 'post', pathname: `/list/${listId}/delete` };
  sendDeleteRequest(xhrRequest);
  return;
};