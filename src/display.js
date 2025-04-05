import checkIcon from './check.svg';
import uncheckIcon from './uncheck.svg';
import newTaskIcon from './new-task.svg';
import deleteIcon from './delete.svg';

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
    this.priorityTable = ["low", "normal", "high"];
    
    this.handleClickEvents();
    this.handleDialogs();
  }
  
  handleClickEvents() {
    let taskId, projectId, activeTask;
    
    const actionMap = {
      'add-task-button': () => {
        this.taskDialog.querySelector("input[name='project-id']").value = projectId;
        this.taskDialog.showModal();
      },
      'delete-task-button': () => this.handler.task.delete(projectId, taskId),
      'delete-project-button': () => this.handler.project.delete(projectId),
      'task-completion-button': () => this.handler.task.toggleCompletion(projectId, taskId),
      'task-info': () => {
        this.shrinkTask(activeTask);
        const info = event.target.closest('.task-info');
        this.expandTask(info);
        activeTask = info;
      },
      'close-active-task': () => this.shrinkTask(activeTask)
    };
    
    this.container.addEventListener("click", (event) => {
      const element = event.target;
      const task = element.closest(".task");
      const project = element.closest(".project");
      
      if (task) taskId = task.dataset.id;
      if (project) projectId = project.dataset.id;
      
      // Determine which action to perform
      const action = this.determineAction(element);
      if (action && actionMap[action]) {
        actionMap[action]();
      }
    });

    document.querySelector("#add-project").addEventListener("click", () => this.projectDialog.showModal());
  }

  determineAction(element) {
    if (element.classList.contains("add") || element.closest(".add")) return 'add-task-button';
    if (element.classList.contains("delete") && element.closest(".task")) return 'delete-task-button';
    if (element.classList.contains("delete") && element.closest(".project")) return 'delete-project-button';
    if (element.classList.contains("task-completion") || element.closest(".task-completion")) return 'task-completion-button';
    if (element.classList.contains("active") || element.closest(".active")) return 'close-active-task';
    if (element.classList.contains("task-info") || element.closest(".task-info")) return 'task-info';
    return null;
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

  expandTask(task) {
    task.classList.add("active");
  }

  shrinkTask(activeTask) {
    if (activeTask != undefined) activeTask.classList.remove("active");
  }

  renderTaskCompletion(taskId, task) {
    const completion = this.taskElements[taskId].querySelector(".task-completion");
    const svg = task.completed ? checkIcon : uncheckIcon; 
    completion.innerHTML = `<img width="24" height="24" src="${svg}" alt="Task Completion">`;
  }

  renderProjectCompletion(projectId, project) {
    const completion = this.projectElements[projectId].querySelector(".project-completion");
    const svg = project.completed ? checkIcon : uncheckIcon; 
    completion.innerHTML = `<img width="24" height="24" src="${svg}" alt="Project Completion">`;
  }
  
  createProject(project) {
    const projectElement = this.createElement("div", "project");
    const projectTitle = this.createElement("h3", "project-title");
    const projectDescription = this.createElement("p", "project-description");
    const projectTasks = this.createElement("ul", "project-tasks");
    const projectCompleted = this.createElement("button", "button project-completion");
    const deleteProject = this.createElement("button", "button delete");
    const addTask = this.createElement("button", "button add");
    
    projectElement.dataset.id = project.id;
    projectTitle.textContent = project.title;
    projectDescription.textContent = project.description;
    
    const svg = project.completed ? checkIcon : uncheckIcon; 
    projectCompleted.innerHTML = `<img width="24" height="24" src="${svg}" alt="Project Completion">`;

    deleteProject.innerHTML = `
      <img width="24" height="24" src="${deleteIcon}" alt="Delete Project">
      <span>Delete Project</span>
    `;
    addTask.innerHTML = `
      <img width="24" height="24" src="${newTaskIcon}" alt="Add Task">
      <span>Add Task</span>
    `;

    for (const id in project.tasks) {
      const task = this.createTask(project.tasks[id]);
      projectTasks.append(task);
    }
        
    projectElement.append(projectCompleted, projectTitle, projectDescription, projectTasks, addTask, deleteProject);
    this.projectElements[project.id] = projectElement;
    return projectElement;
  }

  createTask(task) {
    const taskElement = this.createElement("li", "task");
    const taskInfo = this.createElement("div", "task-info");
    const taskTitle = this.createElement("h4", "task-title");
    const taskDescription = this.createElement("p", "task-description");
    const taskDueDate = this.createElement("span", "task-due-date");
    const taskCompleted = this.createElement("button", "button task-completion");
    const deleteTask = this.createElement("button", "button delete");
    
    taskElement.dataset.id = task.id;
    taskTitle.textContent = task.title;
    taskDescription.textContent = task.description;
    taskDueDate.textContent = task.dueDate;
    deleteTask.innerHTML = `
      <img width="24" height="24" src="${deleteIcon}" alt="Delete Task">
      <span>Delete Task</span>
    `;
    
    const svg = task.completed ? checkIcon : uncheckIcon; 
    taskCompleted.innerHTML = `<img width="24" height="24" src="${svg}" alt="Task Completion">`;
    
    taskInfo.style.backgroundColor = `var(--priority-background-${this.priorityTable[task.priority]})`;
    taskInfo.style.borderColor = `var(--priority-${this.priorityTable[task.priority]})`;

    taskInfo.append(taskTitle, taskDueDate, deleteTask, taskDescription);
    taskElement.append(taskCompleted, taskInfo);
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