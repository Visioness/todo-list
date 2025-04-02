import Project from "./project.js";
import Task from "./task.js";
import Display from "./display.js";

let displayController;
const projects = {};
const handlers = {
  project: {
    create: (title, description) => {
      const newProject = new Project(title, description);
      projects[newProject.id] = newProject;
      displayController.renderProjects(projects);
      console.log("Project added");
    },
    
    delete: (projectId) => {
      delete projects[projectId];
      displayController.renderProjects(projects);
      console.log("Project deleted");
    }
  },
  
  task: {
    create: (projectId, title, description, dueDate, priority) => {
      projects[projectId].addTask(new Task(title, description, dueDate, priority));
      displayController.renderProjects(projects);
      console.log("Task added to the project");
    },
    
    delete: (projectId, taskId) => {
      projects[projectId].deleteTask(taskId);
      displayController.renderProjects(projects);
      console.log("Task deleted from the project");
    }
  }
}

displayController = new Display(handlers);
