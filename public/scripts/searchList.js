const updatePage = lists => {
  const ulTag = document.querySelector('ul');
  ulTag.innerHTML = lists;
  return;
};

const filterPage = todos => {
  let lists = '';
  todos.forEach(({ title, date, id, deleted }) => {
    if (!deleted) {
      const hrefFile = `list/${id}/view`;
      const titleSpan = createTagWithClass('span', title, 'list-title');
      const dateText = `( Last modified : ${date} )`;
      const dateSpan = tagWithId('span', 'date', dateText);
      const link = createLink(titleSpan + dateSpan, hrefFile);

      const editSpan = createEmoji('edit', id, 'edit', 'openEditPopup(event)');
      const deleteSpan = createEmoji('delete', id, 'delete_forever', 'deleteList(event)');
      const newList = tagWithClassAndId('li', 'list', id, link + editSpan + deleteSpan);

      lists += newList;
    }
  });
  updatePage(lists);
  return;
};

const sendSearchRequest = xhrRequest => {
  const { method, pathname } = xhrRequest;
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const todos = JSON.parse(xhr.response);
    filterPage(todos);
    return;
  };
  xhr.open(method, pathname);
  xhr.send();
  return;
};

const searchList = event => {
  event.preventDefault();
  let searchText = event.target.value.toLowerCase();
  if (searchText.length === 0) {
    searchText = 'all';
  }
  const xhrRequest = { method: 'get', pathname: `/list/${searchText}/search` };
  sendSearchRequest(xhrRequest);
  return;
};