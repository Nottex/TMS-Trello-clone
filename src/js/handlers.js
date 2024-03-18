import { data } from "./data.js";
import {
  modalInputTitleElement,
  modalDescriptionElement,
  selectUsersElement,
  editTitleElement,
  editDescriptionElement,
  editUsersElement,
  hiddenInputElement,
  modalEdit,
  editFormElement,
} from "./trello.js";
import { Todo } from "./models.js";
import { setDataToStorage, render, resetModal } from "./helpers.js";

function handleClickConfirmButton() {
  const title = modalInputTitleElement.value;
  const description = modalDescriptionElement.value;
  const userName =
    selectUsersElement.options[selectUsersElement.selectedIndex].text;
  const newTodo = new Todo(title, description, userName);

  data.push(newTodo);

  setDataToStorage(data);
  render(data);
  resetModal();
}

function handleClickRemoveButton({ target }) {
  const { role } = target.dataset;

  if (role !== "remove") return;

  const rootElement = target.closest(".todo__cards-item");
  const { id } = rootElement.dataset;

  const index = data.findIndex((todo) => todo.id == id);

  data.splice(index, 1);

  setDataToStorage(data);
  render(data);
}

// Перемещение по колонкам
function changeColumn({ target }) {
  const { role } = target.dataset;

  if (role !== "check") return;

  const rootElement = target.closest(".todo__cards-item");
  const { id } = rootElement.dataset;

  const currElemOfData = data.find((todo) => todo.id == id);

  const selectElement = rootElement.querySelector(".item-tools__select");

  const selectValue = selectElement.value;

  // Alert на 6 заданий в In Progress
  let inProgressCounter = 0;

  data.forEach((todo) => {
    if (todo.state == "inProgress") {
      inProgressCounter += 1;
    }
  });

  if (inProgressCounter >= 6 && selectValue === "inProgress") {
    alert("Выполните текущие задачи, прежде чем добавлять новые!");
    render(data);
    return;
  }

  currElemOfData.state = `${selectValue}`;

  setDataToStorage(data);
  render(data);
}

function deleteDoneTodos() {
  const confirmDelete = confirm(
    "Вы уверены, что хотите удалить все выполненные задачи?"
  );

  if (confirmDelete) {
    const filteredData = data.filter((todo) => todo.state !== "done");
    data.length = 0;
    filteredData.forEach((todo) => data.push(todo));
    setDataToStorage(data);
    render(data);
  } else {
    return;
  }
}

function handleClickEditButton({ target }) {
  const { role } = target.dataset;

  if (role !== "edit") return;

  const rootElement = target.closest(".todo__cards-item");
  const { id } = rootElement.dataset;

  const currElem = data.find((todo) => todo.id == id);

  modalEdit.show();

  hiddenInputElement.value = `${currElem.id}`;

  editTitleElement.value = currElem.title;
  editDescriptionElement.value = currElem.description;
  editUsersElement.options[editUsersElement.selectedIndex].text =
    currElem.userName;

  editFormElement.addEventListener("submit", () => {
    currElem.title = editTitleElement.value;
    currElem.description = editDescriptionElement.value;
    currElem.userName =
      editUsersElement.options[editUsersElement.selectedIndex].text;
    setDataToStorage(data);
    render(data);
  });
}

export {
  handleClickConfirmButton,
  handleClickRemoveButton,
  changeColumn,
  deleteDoneTodos,
  handleClickEditButton,
};
