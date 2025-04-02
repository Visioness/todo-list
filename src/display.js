export default class Display {
  constructor(handler) {
    this.handler = handler;
    this.container = this.createContainer();
    this.handleClickEvents();
  }
  
  handleClickEvents() {
    this.container.addEventListener("click", (event) => {
      const element = event.target;
      const task = event.target.closest(".task");
      const project = event.target.closest(".project");
      let taskId, projectId;
      
      if (task) {
        taskId = task.dataset.id;
      }

      if (project) {
        projectId = project.dataset.id;
      }

      if (element.id === "add-project") {
        // Add Project
        this.handler.project.create("New Project", "Project Description");
      } else if (element.classList.contains("add") && project) {
        // Add Task
        this.handler.task.create(projectId, "New Task", "Task Description", "Task Due Date", "Task Priority");
      } else if (element.classList.contains("delete") && task) {
        // Delete Task
        this.handler.task.delete(projectId, taskId);
      } else if (element.classList.contains("delete") && project) {
        // Delete Project
        this.handler.project.delete(projectId);
      }
    });
  }
  
  resetContainer() {
    // IMPROVE
    document.querySelector("main").innerHTML = "";
    this.container = this.createContainer();
    this.handleClickEvents();
  }

  createContainer() {
    const container = this.createElement("div", "container projects", "projects");
    const containerTitle = this.createElement("h2", "container-title", "projects-title");
    containerTitle.textContent = "Projects";

    const addProject = this.createElement("button", "button add", "add-project");
    addProject.textContent = "Add Project";

    container.append(addProject, containerTitle);
    document.querySelector("main").append(container);
    
    return container;
  }

  renderProjects(projects) {
    this.resetContainer();

    for (const id in projects) {
      const projectElement = this.createProject(projects[id]);
      this.container.append(projectElement);
    }
  }
  
  createProject(project) {
    const projectElement = this.createElement("div", "project");
    projectElement.dataset.id = project.id;
    
    const projectTitle = this.createElement("h3", "project-title");
    projectTitle.textContent = project.title;

    const projectDescription = this.createElement("p", "project-description");
    projectDescription.textContent = project.description;

    const projectTasks = this.createElement("ul", "project-tasks");
    for (const id in project.tasks) {
      const task = this.createTask(project.tasks[id]);
      projectTasks.append(task);
    }
    
    const deleteProject = this.createElement("button", "button delete");
    deleteProject.textContent = "Delete Project";

    const addTask = this.createElement("button", "button add");
    addTask.textContent = "Add Task"; 
    
    projectElement.append(addTask, deleteProject, projectTitle, projectDescription, projectTasks);
    return projectElement;
  }

  createTask(task) {
    const taskElement = this.createElement("li", "task");
    taskElement.dataset.id = task.id;

    const taskTitle = this.createElement("h4", "task-title");
    taskTitle.textContent = task.title;

    const taskDescription = this.createElement("p", "task-description");
    taskDescription.textContent = task.description;

    const taskDueDate = this.createElement("span", "task-due-date");
    taskDueDate.textContent = task.dueDate;

    const taskPriority = this.createElement("span", "task-priority");
    taskPriority.textContent = task.priority;

    const deleteTask = this.createElement("button", "button delete");
    deleteTask.textContent = "Delete Task";

    taskElement.append(deleteTask, taskTitle, taskDescription, taskDueDate, taskPriority);
    return taskElement;
  }


  createElement(tag, className = "", id = "") {
    const element = document.createElement(tag);
    element.className = className;
    element.id = id;
    
    return element;
  }
}