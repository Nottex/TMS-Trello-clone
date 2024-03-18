import { Modal, Dropdown } from "bootstrap";
import { data } from "./data.js";
import { render, $, setDataToStorage } from "./helpers.js";
import {
  handleClickConfirmButton,
  handleClickRemoveButton,
  changeColumn,
  deleteDoneTodos,
  handleClickEditButton,
} from "./handlers.js";

if (data.length) {
  render(data);
}

export {
  modalInputTitleElement,
  modalDescriptionElement,
  selectUsersElement,
  editTitleElement,
  editDescriptionElement,
  hiddenInputElement,
  editUsersElement,
  modalEdit,
  editFormElement,
};

// Всплытие модального окна
const addTodoBtnElement = $(".add-todo__button");
const modalCreateElement = $(".modal__create");

addTodoBtnElement.addEventListener("shown.bs.modal", () => {
  modalCreateElement.show();
});

// Открытие модального окна для редактирования
const modalEdit = new Modal(".modal__edit", {
  keyboard: false,
});

const confirmBtnElement = $(".modal__confirm-btn");
const modalInputTitleElement = $(".modal__input-title");
const modalDescriptionElement = $(".modal__description-input");
const selectUsersElement = $(".create-users__select");
const todoItemElem = $(".todos");
const editUsersElement = $(".edit-users__select");
const deleteAllBtnElement = $(".delete-all__button");
const editTitleElement = $(".edit-modal__input-title");
const editDescriptionElement = $(".edit-modal__description-input");
const editFormElement = $(".edit-form");
const hiddenInputElement = $("#hidden-input");

confirmBtnElement.addEventListener("click", handleClickConfirmButton);

todoItemElem.addEventListener("click", handleClickRemoveButton);

todoItemElem.addEventListener("change", changeColumn);

deleteAllBtnElement.addEventListener("click", deleteDoneTodos);

todoItemElem.addEventListener("click", handleClickEditButton);

// Fetch запрос
fetch("https://jsonplaceholder.typicode.com/users")
  .then((response) => response.json())
  .then((users) => {
    renderUsers(users);
  });

// Шаблон option
function buildUsers({ id, name }) {
  return `
				<option value="${id}">${name}</option>
	`;
}

// Отрисовка списка из fetch
function renderUsers(users) {
  let html = "";

  users.forEach((users) => {
    const template = buildUsers(users);
    html += template;
  });

  selectUsersElement.insertAdjacentHTML("beforeend", html);
  editUsersElement.insertAdjacentHTML("beforeend", html);
}
