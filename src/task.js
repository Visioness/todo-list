export default class Task {
  constructor(title, description, dueDate, priority, completed = false) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description || "Task Description";
    this.dueDate = dueDate || new Date().toDateString();
    this.priority = priority;
    this.completed = completed;
  }

  toggleCompletion() {this.completed = !this.completed;}
}
