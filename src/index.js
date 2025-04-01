import Project from "./project.js";
import Task from "./task.js";
import Display from "./display.js";


const projects = [];
console.log("------")
console.log(projects);
console.log("------")
const handlers = {
  project: {
    create: (title, description) => {
      console.log("------")
      console.log(projects);
      projects.push(new Project(title, description));
      // Display.renderProjects(projects);
      console.log("Project added");
      console.log(projects);
      console.log("------")
    },
    
    delete: (index) => {
      console.log("------")
      console.log(projects);
      projects.splice(index, 1);
      // Display.renderProjects(projects);
      console.log("Project deleted");
      console.log(projects);
      console.log("------")
    }
  },

  task: {
    create: (projectIndex, title, description, dueDate, priority) => {
      console.log("------")
      console.log(projects[projectIndex]);
      projects[projectIndex].addTask(new Task(title, description, dueDate, priority));
      // Display.renderTasks(projects[projectIndex]);
      console.log("Task added to the project");
      console.log(projects[projectIndex]);
      console.log("------")
    },

    delete: (projectIndex, task) => {
      console.log("------")
      console.log(projects[projectIndex]);
      projects[projectIndex].deleteTask(task);
      // Display.renderTasks(projects[projectIndex]);
      console.log("Task deleted from the project");
      console.log(projects[projectIndex]);
      console.log("------")
    }
  }
}

setTimeout(() => {

  handlers.project.create("Project-1", "Desc-1");
  handlers.project.create("Project-2", "Desc-2");
  handlers.project.create("Project-3", "Desc-3");
  handlers.project.delete(2);
  
  
  handlers.task.create(0, "Task-1", "Desc-1", "Due-1", "Prio-1");
  handlers.task.create(0, "Task-2", "Desc-2", "Due-2", "Prio-2");
  handlers.task.create(0, "Task-3", "Desc-3", "Due-3", "Prio-3");
  handlers.task.delete(0, 2);
  
  handlers.task.create(1, "Task-4", "Desc-4", "Due-4", "Prio-4");
  }, 5000
)