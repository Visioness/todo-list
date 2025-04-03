export default class Project {
  constructor(title, description = new Date().toDateString()) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.tasks = {};
  }

  addTask(newTask) {
    this.tasks[newTask.id] = newTask;
  }

  deleteTask(taskId) {
    delete this.tasks[taskId];
  }

  checkProjectCompletion() {
    return Object.values(this.tasks).every(task => task.completed === true)
  }
}
