export default class Display {
  constructor(handler) {
    this.handler = handler;
    this.main = document.querySelector("main");
    this.container = this.main.querySelector(".container");
    this.content = this.container.querySelector(".projects");
    this.projectDialog = this.main.querySelector("#project-dialog");
    this.taskDialog = this.main.querySelector("#task-dialog");
    this.projectElements = {};
    this.taskElements = {};
    
    this.handleClickEvents();
    this.handleDialogs();
  }
  
  handleClickEvents() {
    this.container.addEventListener("click", (event) => {
      const element = event.target;
      const task = event.target.closest(".task");
      const project = event.target.closest(".project");
      let taskId, projectId;
      
      if (task) taskId = task.dataset.id;
      if (project) projectId = project.dataset.id;

      if (element.id === "add-project") {
        // Add Project
        this.projectDialog.showModal();
      } else if (element.classList.contains("add") && project) {
        // Add Task
        this.taskDialog.querySelector("input[name='project-id']").value = projectId;
        this.taskDialog.showModal();
      } else if (element.classList.contains("delete") && task) {
        // Delete Task
        this.handler.task.delete(projectId, taskId);
      } else if (element.classList.contains("delete") && project) {
        // Delete Project
        this.handler.project.delete(projectId);
      } else if (element.classList.contains("task-completion")) {
        this.handler.task.toggleCompletion(projectId, taskId);
      }
    });
  }
  
  handleDialogs() {
    const projectForm = this.projectDialog.querySelector("form");
    const taskForm = this.taskDialog.querySelector("form");
    
    [taskForm, projectForm].forEach(form => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleFormSubmit(form);
      });

      this.handleFormCancel(form);
    });
  }

  handleFormSubmit(form) {
    let title, description, dueDate, priority, projectId;
    
    title = form.elements.title.value;
    description = form.elements.description.value;
    
    if (form.id === "project-form") {
      this.handler.project.create(title, description);
      this.projectDialog.close();
    } else if (form.id === "task-form") {
      dueDate = form.elements["due-date"].value;
      priority = form.elements.priority.value;
      projectId = this.taskDialog.querySelector("input[name='project-id']").value;
      this.handler.task.create(projectId, title, description, dueDate, priority);
      this.taskDialog.close();
    }

    form.reset();
  }
  
  handleFormCancel(form) {
    const formDialog = form.closest(".form-dialog");
    const cancelButton = form.querySelector(".cancel-form");
    cancelButton.addEventListener("click", () => {
      formDialog.close();
      form.reset();
    });
  }

  renderAll(projects) {
    for (const id in projects) {
      const projectElement = this.createProject(projects[id]);
      this.content.append(projectElement);
    }
  }

  renderProject(project) {
    const newProjectElement = this.createProject(project);
    this.content.append(newProjectElement);
  }

  renderTask(task, projectId) {
    const newTaskElement = this.createTask(task);
    const ulElement = this.projectElements[projectId].querySelector(".project-tasks");
    ulElement.append(newTaskElement);
  }

  deleteProject(projectId) {
    const project = this.projectElements[projectId];
    this.content.removeChild(project);
  }
  
  deleteTask(taskId) {
    const task = this.taskElements[taskId];
    task.parentNode.removeChild(task);
  }

  renderTaskCompletion(taskId, task) {
    const completion = this.taskElements[taskId].querySelector(".task-completion");
    completion.textContent = task.completed ? "✔️" : "❌";
  }

  renderProjectCompletion(projectId, project) {
    const completion = this.projectElements[projectId].querySelector(".project-completion");
    completion.textContent = project.completed ? "✔️" : "❌";
  }
  
  createProject(project) {
    const projectElement = this.createElement("div", "project");
    const projectTitle = this.createElement("h3", "project-title");
    const projectDescription = this.createElement("p", "project-description");
    const projectTasks = this.createElement("ul", "project-tasks");
    const projectCompleted = this.createElement("span", "project-completion");
    const deleteProject = this.createElement("button", "button delete");
    const addTask = this.createElement("button", "button add");
    
    projectElement.dataset.id = project.id;
    projectTitle.textContent = project.title;
    projectDescription.textContent = project.description;
    projectCompleted.textContent = project.completed ? "✔️" : "❌";
    deleteProject.textContent = "Delete Project";
    addTask.textContent = "Add Task"; 

    for (const id in project.tasks) {
      const task = this.createTask(project.tasks[id]);
      projectTasks.append(task);
    }
        
    projectElement.append(addTask, deleteProject, projectTitle, projectDescription, projectTasks, projectCompleted);
    this.projectElements[project.id] = projectElement;
    return projectElement;
  }

  createTask(task) {
    const taskElement = this.createElement("li", "task");
    const taskTitle = this.createElement("h4", "task-title");
    const taskDescription = this.createElement("p", "task-description");
    const taskDueDate = this.createElement("span", "task-due-date");
    const taskPriority = this.createElement("span", "task-priority");
    const taskCompleted = this.createElement("span", "task-completion");
    const deleteTask = this.createElement("button", "button delete");
    
    taskElement.dataset.id = task.id;
    taskTitle.textContent = task.title;
    taskDescription.textContent = task.description;
    taskDueDate.textContent = task.dueDate;
    taskPriority.textContent = task.priority;
    taskCompleted.textContent = task.completed ? "✔️" : "❌";
    deleteTask.textContent = "Delete Task";

    taskElement.append(deleteTask, taskTitle, taskDescription, taskDueDate, taskPriority, taskCompleted);
    this.taskElements[task.id] = taskElement;
    return taskElement;
  }

  createElement(tag, className = "", id = "") {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (id) element.id = id;
    
    return element;
  }
}