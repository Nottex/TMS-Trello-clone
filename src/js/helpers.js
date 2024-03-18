import { buildTemplate } from "./templates.js";
import { data } from "./data.js";
import {
  modalInputTitleElement,
  modalDescriptionElement,
  selectUsersElement,
} from "./trello.js";

function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return [...document.querySelectorAll(selector)];
}

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

function setDataToStorage(data) {
  localStorage.setItem("data", JSON.stringify(data));
}

function render(data) {
  resetView();

  data.forEach((todo) => {
    const template = buildTemplate(todo);
    const containerElement = $(`#${todo.state}`);

    containerElement.insertAdjacentHTML("beforeend", template);
  });

  updateCounters();
}

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

function currentTime() {
  const clockHoursElement = $(".header__clock-hours");
  const clockMinutesElement = $(".header__clock-minutes");
  const time = new Date();
  let hours = time.getHours().toString().padStart(2, "0");
  let minutes = time.getMinutes().toString().padStart(2, "0");

  clockHoursElement.textContent = `${hours}`;
  clockMinutesElement.textContent = `${minutes}`;
}
setInterval(currentTime, 100);

// Reset modal
function resetModal() {
  modalInputTitleElement.value = "";
  modalDescriptionElement.value = "";
  selectUsersElement.value = "1";
}

export {
  getDataFromStorage,
  setDataToStorage,
  render,
  $,
  updateCounters,
  resetView,
  currentTime,
  resetModal,
};
