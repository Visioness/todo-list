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
      displayController.renderProjects(projects);
      saveChanges();
    },
    
    delete: (projectId) => {
      delete projects[projectId];
      displayController.renderProjects(projects);
      saveChanges();
    }
  },
  
  task: {
    create: (projectId, title, description, dueDate, priority) => {
      projects[projectId].addTask(new Task(title, description, dueDate, priority));
      displayController.renderProjects(projects);
      saveChanges();
    },
    
    delete: (projectId, taskId) => {
      projects[projectId].deleteTask(taskId);
      displayController.renderProjects(projects);
      saveChanges();
    }
  }
}

function saveChanges() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function loadSave() {
  const projectsJSON = localStorage.getItem("projects");
  if (projectsJSON == null) return false;
  
  const objects = JSON.parse(projectsJSON);
  for (const project in objects) {
    const projectObject = objects[project];
    const newProject = new Project(projectObject.title, projectObject.description);
    
    for (const task in projectObject.tasks) {
      const taskObject = projectObject.tasks[task];
      const newTask = new Task(
        taskObject.title, 
        taskObject.description, 
        taskObject.dueDate, 
        taskObject.priority,
        taskObject.completed
      );
      newProject.tasks[newTask.id] = newTask;
    }
    
    projects[newProject.id] = newProject;
  }
}

displayController = new Display(handlers);
displayController.renderProjects(projects);