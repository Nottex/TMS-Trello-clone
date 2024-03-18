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

export { buildTemplate };
