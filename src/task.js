export default class Task {
  constructor(
    title,
    description = new Date().toDateString(), 
    dueDate = "-",
    priority,
    completed = false
  ) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = completed;
  }

  toggleCompletion() {this.completed = !this.completed;}
}
