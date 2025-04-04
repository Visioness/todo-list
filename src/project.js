export default class Project {
  constructor(title, description, completed = false) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.tasks = {};
  }

  addTask(newTask) {
    this.tasks[newTask.id] = newTask;
  }

  deleteTask(taskId) {
    delete this.tasks[taskId];
  }

  checkCompletion() {
    return Object.values(this.tasks).every(task => task.completed === true);
  }
}
