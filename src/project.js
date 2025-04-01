export default class Project {
  constructor(title, description = new Date().toDateString()) {
    this.title = title;
    this.description = description;
    this.tasks = [];
  }

  addTask(newTask) {
    this.tasks.push(newTask);
  }

  deleteTask(taskIndex) {
    this.tasks.splice(taskIndex, 1);
  }

  checkProjectCompletion() {
    return this.tasks.every(task => task.completed === true)
  }
}