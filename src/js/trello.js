import { Modal, Dropdown } from 'bootstrap'

function $(selector) {
	return document.querySelector(selector)
}

function $$(selector) {
	return [...document.querySelectorAll(selector)]
}

// const data = [];

// Всплытие модального окна
const addTodoBtnElement = $(".cards-item__button");
const modal = $("#staticBackdrop");

addTodoBtnElement.addEventListener("shown.bs.modal", () => {
	modal.show();
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

const data = getDataFromStorage();

// Создание новой карточки
function createTodo(title, description, userName) {
	const todo = {
		id: Date.now(),
		title,
		description,
		createdAt: new Date(),
		state: "todo",
		userName,
	};

	return todo;
}

// Шаблон карточки
const confirmBtnElement = $(".modal__confirm-btn");

function buildTemplate({ id, title, description, createdAt, userName, state }) {
	const time = `${createdAt.getDate().toString().padStart(2, "0")}.${
		(createdAt.getMonth() + 1).toString().padStart(2,'0')
	}.${createdAt.getFullYear()} ${createdAt
		.getHours()
		.toString()
		.padStart(2, "0")}:${createdAt.getMinutes().toString().padStart(2, "0")}`;

	return `<div class="todo__cards-item card__todo" data-id="${id}" data-state="${state}">
								<span class="cards__item-text cards__item-title">${title}</span>
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
											class="item-tools__btn item-tools__edit"
											type="submit"
										>
											Edit
										</button>
										<select class="item-tools__btn item-tools__select" data-role="check">
											<option value=''>State</option>
											<option value="todo">Todo</option>
											<option value="inProgress">In Progress</option>
											<option value="done">Done</option>
										</select>
										<button class="item-tools__btn item-tools__delete" data-role="remove">
											Delete
										</button>
									</div>
								</div>
							</div>`;
}

// Handlers
const modalInputTitleElement = $(".modal__input-title");
const modalDescriptionElement = $(".modal__description-input");
const modalUserNameElement = $(".modal__footer-select");

function handleClickConfirmButton() {
	const title = modalInputTitleElement.value;
	const description = modalDescriptionElement.value;
	const userName =
		modalUserNameElement.options[modalUserNameElement.selectedIndex].text;
	const newTodo = createTodo(title, description, userName);

	data.push(newTodo);
	setDataToStorage();
	render();
	resetModal();
}

confirmBtnElement.addEventListener("click", handleClickConfirmButton);

// render
const todoContainer = $("#todo");
const inProgressContainer = $('#inProgress') 
const doneContainer = $('#done')

// function render() {
// 	let html = ''

// 	data.forEach((todo) => {
// 		const template = buildTemplate(todo);
// 		const containerElement = $(`#${todo.state}`)
// 		html += template
// 		containerElement.innerHTML = html
// 		}
// 	)
	
// }

// !! НЕ РАБОЧИЙ через insertAdjacent(Плодит много копий)
function render() {
	resetView()
	
	data.forEach((todo) => {
		const template = buildTemplate(todo);
		const containerElement = $(`#${todo.state}`)

		containerElement.insertAdjacentHTML('beforeend', template)
		})
	
	updateCounters()
}

// function render() {
// 	let html = ''

// 	data.forEach((todo) => {
// 		const template = buildTemplate(todo);
// 		const containerElement = $(`#${todo.state}`)
// 		html += template
// 		containerElement.innerHTML = html
// 	})
	
// }

// !!НЕ РАБОЧИЙ рендер через IF
// function render() {
// 	let html = ''
	
	
// 	data.forEach((todo) => {
// 		const template = buildTemplate(todo);
// 		html += template

// 		if (todo.state == 'todo') {
// 			todoContainer.innerHTML = html
// 		} else if (todo.state == 'inProgress') {
// 			inProgressContainer.innerHTML = html
// 		} else if (todo.state == 'done') {
// 			doneContainer.innerHTML = html
// 		}
// 	})

		
// }


function resetView() {
	const todoElem = $('#todo')
	const progressElem = $('#inProgress')
	const doneElem = $('#done')

	todoElem.innerHTML = ''
	progressElem.innerHTML = ''
	doneElem.innerHTML = ''
}

// Todo counter
function updateCounters() {
	const todoCounterElement = $(".todo-counter");
	const inProgressCounterElement = $('.inProgress-counter')
	const doneCounterElement = $('.done-counter')

	let todoCounter = 0;
	let inProgressCounter = 0;
	let doneCounter = 0;

	data.forEach((todo) => {
		if(todo.state == 'todo') {
			todoCounter += 1
		} else if( todo.state == 'inProgress') {
			inProgressCounter += 1
		} else if( todo.state == 'done') {
			doneCounter += 1
		}
	})

	todoCounterElement.textContent = todoCounter;
	inProgressCounterElement.textContent = inProgressCounter;
	doneCounterElement.textContent = doneCounter;
}

// Reset modal
function resetModal() {
	modalInputTitleElement.value = "";
	modalDescriptionElement.value = "";
}

// Удаление текущей карточки
const todoItemElem = $('.todos')

function handleClickRemoveButton({ target }) {
	const { role } = target.dataset;

	if (role !== "remove") return;

	const rootElement = target.closest(".todo__cards-item");
	const { id } = rootElement.dataset;

	const index = data.findIndex((todo) => todo.id == id);

	data.splice(index, 1);

	// rootElement.remove() // если не прописать, то удаляет эл-т в массиве, но не с вёрстки
	
	setDataToStorage();
	render();
}

todoItemElem.addEventListener('click', handleClickRemoveButton) // Рабочая версия кнопки удаления
// todoCardsElement.addEventListener("click", handleClickRemoveButton);


if (data.length) {
	render();
}

// TEST ANYTHING
// const dataProgress = [];

// function changeColumn({ target }) {
// 	const { role } = target.dataset;

// 	if (role !== "check") return;

// 	const rootElement = target.closest(".todo__cards-item");
// 	const { id } = rootElement.dataset;

// 	const currElemOfData = data.find((todo) => todo.id == id);

// 	console.log(currElemOfData);
// 	const selectElement = $('.item-tools__select')
// 	const selectValue = selectElement.value

// 	currElemOfData.state = `${selectValue}`

// 	setDataToStorage();
// 	updateCounters();
// 	// rootElement.remove()
// 	render()
// 	// console.log(currElemOfData);	
// }

function changeColumn2({ target }) {
	const { role } = target.dataset;

	if (role !== "check") return;

	const rootElement = target.closest(".todo__cards-item");
	const { id } = rootElement.dataset;

	const currElemOfData = data.find((todo) => todo.id == id);

	console.log(currElemOfData);

	const selectElement = $('.item-tools__select')
	const selectValue = selectElement.value

	currElemOfData.state = `${selectValue}`

	//Попытка алерта (Вроде работает)
	let test = 0;

	data.forEach((todo) => {
		if (todo.state == 'inProgress') {
			test += 1
			console.log(test);
		} 
	})

	if(test == 7) {
		alert('Warning')

		setDataToStorage()

		return
	}

	setDataToStorage();
	render()
	console.log(currElemOfData);	
}

function newStatus() {
	const selectElement = $('.item-tools__select')
	const selectValue = selectElement.value

	currElemOfData.state = `${selectValue}`
	setDataToStorage()
}

todoItemElem.addEventListener('change', changeColumn2)  // Рабочий
// const todoCardsElement = $('.todo__card')
// todoContainer.addEventListener('change', changeColumn)
// inProgressContainer.addEventListener('change', changeColumn)
// doneContainer.addEventListener('change', changeColumn)

// 	if (currElemOfData.state == "todo") {
// 		dataProgress.push(currElemOfData);
// 		data.pop();
// 		setDataToStorage();
// 		updateCounters();
// 		render();
// 	}
// 	renderTest();
// }

// todoCardsElement.addEventListener("click", changeColumn);

// const cardsProgress = $(".todo__card-progress");
// function renderTest() {
// 	let html = "";

// 	dataProgress.forEach((todo) => {
// 		const template = buildTemplate(todo);
// 		html += template;
// 	});

// 	cardsProgress.innerHTML = html;
// }