const itemInput = document.getElementById("itemInput");
const addItemBtn = document.getElementById("addItem");
const list = document.getElementById("shoppingList");
const listCodeInput = document.getElementById("listCode");
const loadListBtn = document.getElementById("loadList");
const newListBtn = document.getElementById("newList");

let currentCode = "";

function getStorageKey() {
  return `list_${currentCode}`;
}

function loadList() {
  const stored = localStorage.getItem(getStorageKey());
  list.innerHTML = "";
  if (stored) {
    JSON.parse(stored).forEach((item) => addItemToDOM(item));
  }
}

function saveList() {
  const items = Array.from(list.children).map(li => li.firstChild.textContent);
  localStorage.setItem(getStorageKey(), JSON.stringify(items));
}

function addItemToDOM(text) {
  const li = document.createElement("li");
  li.textContent = text;
  const delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.onclick = () => {
    li.remove();
    saveList();
  };
  li.appendChild(delBtn);
  list.appendChild(li);
}

addItemBtn.onclick = () => {
  const text = itemInput.value.trim();
  if (text && currentCode) {
    addItemToDOM(text);
    saveList();
    itemInput.value = "";
  } else {
    alert("Primero introduce un código de lista.");
  }
};

loadListBtn.onclick = () => {
  currentCode = listCodeInput.value.trim();
  if (!currentCode) return alert("Introduce un código de lista.");
  loadList();
};

newListBtn.onclick = () => {
  currentCode = prompt
}
