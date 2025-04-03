import Project from "./project.js";
import Task from "./task.js";
import Display from "./display.js";

let displayController;
const projects = {};
loadSave();

const handlers = {
  project: {
    create: (title, description) => {
      const newProject = new Project(title, description);
      projects[newProject.id] = newProject;
      displayController.renderProject(newProject);
      saveChanges();
    },
    
    delete: (projectId) => {
      delete projects[projectId];
      displayController.deleteProject(projectId);
      saveChanges();
    }
  },
  
  task: {
    create: (projectId, title, description, dueDate, priority) => {
      const newTask = new Task(title, description, dueDate, priority);
      projects[projectId].addTask(newTask);
      displayController.renderTask(newTask, projectId);
      saveChanges();
    },
    
    delete: (projectId, taskId) => {
      projects[projectId].deleteTask(taskId);
      displayController.deleteTask(taskId);
      saveChanges();
    }
  }
}

function saveChanges() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function loadSave() {
  const projectsJSON = localStorage.getItem("projects");
  if (!projectsJSON) return;
  
  const objects = JSON.parse(projectsJSON);
  for (const projectId in objects) {
    const projectObj = objects[projectId];
    const newProject = new Project(projectObj.title, projectObj.description);
    
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
    }
    
    projects[newProject.id] = newProject;
  }
}

displayController = new Display(handlers);
displayController.renderAll(projects);
