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

export { Todo };
