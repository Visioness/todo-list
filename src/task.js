export default class Task {
  constructor(
    title,
    description = new Date().toDateString(), 
    dueDate = "-",
    priority = "normal",
  ) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = false;
  }
  
  changeTitle(newTitle) {this.title = newTitle;}
  
  changeDescription(newDescription) {this.description = newDescription;}
  
  changeDueDate(newDate) {this.dueDate = newDate;}
  
  changePriority(newPriority) {this.priority = newPriority;}

  toggleCompletion() {this.completed = !this.completed;}
}