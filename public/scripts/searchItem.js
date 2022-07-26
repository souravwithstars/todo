const updatePage = lists => {
  const itemsContainer = document.getElementById('items-container');
  itemsContainer.innerHTML = lists;
  return;
};

const tagWithClassAndId = (tag, classname, id, value) => {
  return `<${tag} class="${classname}" id="${id}">${value}</${tag}>`;
};

const createEmoji = (classname, id, emojiName, onclick) => {
  return `<span class="${classname}"><i class="material-icons" id="${id}" onclick="${onclick}">${emojiName}</i></span>`;
};

const createCheckBox = (status, id, classname) => {
  const checked = status ? 'checked' : '';
  return `<input type="checkbox" ${checked} class="${classname}" id="${id}" onclick="markItem(event)">`;
};

const createTagWithClass = (tag, value, classname) => {
  return `<${tag} class="${classname}">${value}</${tag}>`;
};

const createAllItems = (items, searchText) => {
  if (searchText === 'all') {
    searchText = '';
  }
  let lists = '';
  items.forEach(({ item, id, done, deleted }) => {
    if (!deleted && item.includes(searchText)) {
      const checkBox = createCheckBox(done, id, 'checkbox');
      const titleSpan = createTagWithClass('span', item, 'item-title');
      const itemClass = tagWithClassAndId('div', '', 'item', checkBox + titleSpan);
      const editSpan = createEmoji('edit', id, 'edit', 'openEditPopup(event)');
      const deleteSpan = createEmoji('delete', id, 'delete_forever', 'deleteItem(event)');

      const listInner = itemClass + editSpan + deleteSpan;
      lists += tagWithClassAndId('li', 'item', id, listInner);
    }
  })
  return lists;
};

const createAllLists = (todos, searchText) => {
  let lists = '';
  todos.forEach(({ title, items }) => {
    const titleSpan = createTagWithClass('div', `<p>${title}</p>`, 'list-title');
    const itemsHtml = createAllItems(items, searchText);
    if (itemsHtml.length > 0) {
      const ulTag = createTagWithClass('ul', itemsHtml, 'items');
      const newList = createTagWithClass('li', titleSpan + ulTag, 'list');
      lists += newList;
    }
  })
  const ulTag = createTagWithClass('ul', lists, '');
  return ulTag;
};

const filterPage = (todos, searchText, selectedOption) => {
  let lists = '';
  if (selectedOption === 'done') {
    lists = createDoneLists(todos, searchText);
  } else if (selectedOption === 'undone') {
    lists = createUndoneLists(todos, searchText);
  } else {
    lists = createAllLists(todos, searchText);
  }
  updatePage(lists);
  return;
};

const sendSearchRequest = (xhrRequest, searchText, selectedOption) => {
  const { method, pathname } = xhrRequest;
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const todos = JSON.parse(xhr.response);
    filterPage(todos, searchText, selectedOption);
    return;
  };
  xhr.open(method, pathname);
  xhr.send();
  return;
};

const searchItem = event => {
  event.preventDefault();
  let searchText = event.target.value.toLowerCase();
  if (searchText.length === 0) {
    searchText = 'all';
  }
  const selectElement = document.querySelector('select');
  let selectedOption = selectElement.options[selectElement.selectedIndex].value.toLowerCase();
  if (selectedOption.length === 0) {
    selectedOption = 'all';
  }
  const xhrRequest = { method: 'get', pathname: `/item/${searchText}/search` };
  sendSearchRequest(xhrRequest, searchText, selectedOption);
  return;
}