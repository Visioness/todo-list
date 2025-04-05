import "./styles.css";

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
      saveChanges();
      
      displayController.renderProject(newProject);
    },
    
    delete: (projectId) => {
      delete projects[projectId];
      saveChanges();
      
      displayController.deleteProject(projectId);
    }
  },
  
  task: {
    create: (projectId, title, description, dueDate, priority) => {
      const newTask = new Task(title, description, dueDate, priority);
      projects[projectId].addTask(newTask);
      saveChanges();
      
      displayController.renderTask(newTask, projectId);
    },
    
    delete: (projectId, taskId) => {
      projects[projectId].deleteTask(taskId);
      saveChanges();
      
      displayController.deleteTask(taskId);
    },
    
    toggleCompletion: (projectId, taskId) => {
      const project = projects[projectId];
      const task = project.tasks[taskId];
      task.toggleCompletion();
      project.completed = project.checkCompletion();
      saveChanges();
      
      displayController.renderTaskCompletion(taskId, task);
      displayController.renderProjectCompletion(projectId, project);
    }
  }
}

function saveChanges() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function loadSave() {
  const projectsJSON = localStorage.getItem("projects");
  const start = performance.now();
  if (!projectsJSON) return;
  
  const objects = JSON.parse(projectsJSON);
  for (const projectId in objects) {
    const projectObj = objects[projectId];
    const newProject = new Project(projectObj.title, projectObj.description, projectObj.completed);
    displayController.renderProject(newProject);

    for (const taskId in projectObj.tasks) {
      const taskObj = projectObj.tasks[taskId];
      const newTask = new Task(
        taskObj.title, 
        taskObj.description, 
        taskObj.dueDate, 
        taskObj.priority,
        taskObj.completed
      );
      newProject.tasks[newTask.id] = newTask;
      displayController.renderTask(newTask, newProject.id);
    }
    
    projects[newProject.id] = newProject;
  }
}

displayController = new Display(handlers);
loadSave();
