import { Modal, Dropdown } from "bootstrap";

function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return [...document.querySelectorAll(selector)];
}

const data = getDataFromStorage();

if (data.length) {
  render();
}

// Текущее время в header
const clockHoursElement = $(".header__clock-hours");
const clockMinutesElement = $(".header__clock-minutes");

function currentTime() {
  const time = new Date();
  let hours = time.getHours().toString().padStart(2, "0");
  let minutes = time.getMinutes().toString().padStart(2, "0");

  clockHoursElement.textContent = `${hours}`;
  clockMinutesElement.textContent = `${minutes}`;
}
setInterval(currentTime, 100);

// Всплытие модального окна
const addTodoBtnElement = $(".add-todo__button");
const modalCreateElement = $(".modal__create");

addTodoBtnElement.addEventListener("shown.bs.modal", () => {
  modalCreateElement.show();
});

// Local Storage
function getDataFromStorage() {
  const data = localStorage.getItem("data");

  if (data) {
    const dataFromStorage = JSON.parse(data);

    return dataFromStorage.map((todo) => {
      todo.createdAt = new Date(todo.createdAt);
      return todo;
    });
  } else {
    return [];
  }
}

function setDataToStorage() {
  localStorage.setItem("data", JSON.stringify(data));
}

// Создание новой карточки
class Todo {
  constructor(title, description, userName) {
    this.id = Date.now();
    this.title = title;
    this.description = description;
    this.createdAt = new Date();
    this.state = "todo";
    this.userName = userName;
  }
}

// Шаблон карточки
const confirmBtnElement = $(".modal__confirm-btn");

function buildTemplate({ id, title, description, createdAt, userName, state }) {
  const time = `${createdAt.getDate().toString().padStart(2, "0")}.${(
    createdAt.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}.${createdAt.getFullYear()} ${createdAt
    .getHours()
    .toString()
    .padStart(2, "0")}:${createdAt.getMinutes().toString().padStart(2, "0")}`;

  return `<div class="todo__cards-item card__todo" data-id="${id}" data-state="${state}">
								<span class="cards__item-text cards__item-title" data-role="test">${title}</span>
								<span class="cards__item-text cards__item-description"
									>${description}</span
								>
								<span class="cards__item-text cards-item__user-name">${userName}</span>
								<div class="cards__item-info">
									<div class="cards__item-time">
										<span class="item-time">${time}</span>
									</div>
									<div class="cards__item-tools">
										<button
											class="item-tools__btn item-tools__edit" data-role="edit"
											type="button"
										>
											Edit
										</button>
										<select class="item-tools__btn item-tools__select" data-role="check">
											<option value="todo" ${state == "todo" ? "selected" : ""}>Todo</option>
											<option value="inProgress" ${
                        state == "inProgress" ? "selected" : ""
                      }>In Progress</option>
											<option value="done" ${state == "done" ? "selected" : ""}>Done</option>
										</select>
										<button class="item-tools__btn item-tools__delete" data-role="remove">
											Delete
										</button>
									</div>
								</div>
							</div>`;
}

// Создание новой карточки
const modalInputTitleElement = $(".modal__input-title");
const modalDescriptionElement = $(".modal__description-input");
const selectUsersElement = $(".create-users__select");

function handleClickConfirmButton() {
  const title = modalInputTitleElement.value;
  const description = modalDescriptionElement.value;
  const userName =
    selectUsersElement.options[selectUsersElement.selectedIndex].text;
  const newTodo = new Todo(title, description, userName);

  data.push(newTodo);

  setDataToStorage();
  render();
  resetModal();
}

confirmBtnElement.addEventListener("click", handleClickConfirmButton);

// render
function render() {
  resetView();

  data.forEach((todo) => {
    const template = buildTemplate(todo);
    const containerElement = $(`#${todo.state}`);

    containerElement.insertAdjacentHTML("beforeend", template);
  });

  updateCounters();
}

// Очистка колонок
function resetView() {
  const todoElem = $("#todo");
  const progressElem = $("#inProgress");
  const doneElem = $("#done");

  todoElem.innerHTML = "";
  progressElem.innerHTML = "";
  doneElem.innerHTML = "";
}

// Счётчики
function updateCounters() {
  const todoCounterElement = $(".todo-counter");
  const inProgressCounterElement = $(".inProgress-counter");
  const doneCounterElement = $(".done-counter");

  let todoCounter = 0;
  let inProgressCounter = 0;
  let doneCounter = 0;

  data.forEach((todo) => {
    if (todo.state == "todo") {
      todoCounter += 1;
    } else if (todo.state == "inProgress") {
      inProgressCounter += 1;
    } else if (todo.state == "done") {
      doneCounter += 1;
    }
  });

  todoCounterElement.textContent = todoCounter;
  inProgressCounterElement.textContent = inProgressCounter;
  doneCounterElement.textContent = doneCounter;
}

// Reset modal
function resetModal() {
  modalInputTitleElement.value = "";
  modalDescriptionElement.value = "";
  selectUsersElement.value = "1";
}

// Удаление текущей карточки
const todoItemElem = $(".todos");

function handleClickRemoveButton({ target }) {
  const { role } = target.dataset;

  if (role !== "remove") return;

  const rootElement = target.closest(".todo__cards-item");
  const { id } = rootElement.dataset;

  const index = data.findIndex((todo) => todo.id == id);

  data.splice(index, 1);

  setDataToStorage();
  render();
}

todoItemElem.addEventListener("click", handleClickRemoveButton);

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
    render();
    return;
  }

  currElemOfData.state = `${selectValue}`;

  setDataToStorage();
  render();
}

todoItemElem.addEventListener("change", changeColumn);

const editUsersElement = $(".edit-users__select");
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

// Кнопка Delete all
const deleteAllBtnElement = $(".delete-all__button");

function deleteDoneTodos() {
  const confirmDelete = confirm(
    "Вы уверены, что хотите удалить все выполненные задачи?"
  );

  if (confirmDelete) {
    const filteredData = data.filter((todo) => todo.state !== "done");
    data.length = 0;
    filteredData.forEach((todo) => data.push(todo));
    setDataToStorage();
    render();
  } else {
    return;
  }
}

deleteAllBtnElement.addEventListener("click", deleteDoneTodos);

// Edit
const modalEdit = new Modal(".modal__edit", {
  keyboard: false,
});

const editTitleElement = $(".edit-modal__input-title");
const editDescriptionElement = $(".edit-modal__description-input");
const editFormElement = $(".edit-form");
const hiddenInputElement = $("#hidden-input");

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
    setDataToStorage();
    render();
  });
}

todoItemElem.addEventListener("click", handleClickEditButton);
