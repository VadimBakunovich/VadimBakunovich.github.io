const addTaskBtn = document.getElementById('add-task-btn');
const inputTask = document.getElementById('new-task');
const inputTaskWrap = document.getElementById('input-task-wrapper');
const tasksWrapper = document.getElementById('task-list');
const allButtonsImportant = document.querySelectorAll('.task__btn-important');
const typeTaskAll = document.getElementById('all');
const typeTaskActive = document.getElementById('active');
const typeTaskDone = document.getElementById('done');
const searchInput = document.getElementById('search');
let disable = '';

let tasks = [];
!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'));

let toDoListItems = [];

function Task(descr) {
  this.descr = descr;
  this.completed = false;
  this.important = false;
  this.btnImportant = '';
  this.importantBtnText = 'MARK IMPORTANT';
  this.display = '';
};

const createTemplate = (task, index) => {
  return `
    <li ${task.display} class="task">
      <p onclick="completeTask(${index})" class="task__text ${task.completed ? 'task__text--completed' : ''} ${task.important ? 'task__text--important' : ''}">${task.descr}</p>
      <div class="task__btns-wrapper">
        <button ${task.btnImportant} onclick="markTaskImportant(${index})" class="task__btn-important ${task.important ? 'task__btn-important--true' : 'task__btn-important--false'}">${task.importantBtnText}</button>
        <button onclick="delTask(${index})"class="task__btn-del"></button>
      </div>
    </li>
  `
};

const fillToDoList = () => {
  tasksWrapper.innerHTML = "";
  if (tasks.length > 0) {
    tasks.forEach((item, index) => {
      tasksWrapper.innerHTML += createTemplate(item, index);
    });
    toDoListItems = document.querySelectorAll('.task');
  };
};

const updLocalStor = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const completeTask = (index) => {
  tasks[index].completed = !tasks[index].completed;
  if (tasks[index].completed) {
    toDoListItems[index].classList.add('task__text--completed');
    tasks[index].btnImportant = 'hidden';
  }
  else {
    toDoListItems[index].classList.remove('task__text--completed');
    tasks[index].btnImportant = '';
  };
  if (tasks[index].completed && typeTaskActive.matches('.type--selected')) {
    tasks[index].display = 'hidden';
  };
  if (!tasks[index].completed && typeTaskDone.matches('.type--selected')) {
    tasks[index].display = 'hidden';
  };
  updLocalStor();
  fillToDoList();
};

const markTaskImportant = (index) => {
  tasks[index].important = !tasks[index].important;
  if (tasks[index].important) {
    toDoListItems[index].classList.add('task__text--important');
    toDoListItems[index].classList.add('task__btn-important--true');
    tasks[index].importantBtnText = 'NOT IMPORTANT';
  }
  else {
    toDoListItems[index].firstElementChild.classList.remove('task__text--important');
    toDoListItems[index].classList.add('task__btn-important--false');
    tasks[index].importantBtnText = 'MARK IMPORTANT';
  };
  updLocalStor();
  fillToDoList();
};

addTaskBtn.addEventListener('click', () => {
  if (inputTask.value.length != 0) tasks.push(new Task(inputTask.value));
  updLocalStor();
  if (typeTaskActive.matches('.type--selected')) viewActiveTasks()
  else viewAllTasks();
  inputTask.value = '';
  document.getElementById("search").disabled = false;
});

inputTask.addEventListener('keydown', function(event) {
  if (event.key === "Enter") {
    if (inputTask.value.length != 0) tasks.push(new Task(inputTask.value));
    updLocalStor();
    if (typeTaskActive.matches('.type--selected')) viewActiveTasks()
    else viewAllTasks();
    inputTask.value = '';
    event.preventDefault();
    document.getElementById("search").disabled = false;
  };
});

const delTask = (index) => {
  tasks.splice(index, 1);
  updLocalStor();
  if (tasks.length == 0) {
    typeTaskAll.classList.remove('type--selected');
    typeTaskActive.classList.remove('type--selected');
    typeTaskDone.classList.remove('type--selected');
    inputTaskWrap.classList.remove('new-task--hidden');
    document.getElementById("search").disabled = true;
  };
  fillToDoList();
};

const viewAllTasks = () => {
  if (tasks.length > 0) {
    tasks.forEach((item) => item.display = '');
    typeTaskAll.classList.add('type--selected');
    typeTaskActive.classList.remove('type--selected');
    typeTaskDone.classList.remove('type--selected');
    inputTaskWrap.classList.remove('new-task--hidden');
    fillToDoList();
  }
  else document.getElementById("search").disabled = true;
};

const viewActiveTasks = () => {
  if (tasks.length > 0) {
    tasks.forEach((item) => {
      item.display = '';
      if (item.completed) item.display = 'hidden';
    });
    typeTaskAll.classList.remove('type--selected');
    typeTaskActive.classList.add('type--selected');
    typeTaskDone.classList.remove('type--selected');
    inputTaskWrap.classList.remove('new-task--hidden');
    fillToDoList();
  };
};

const viewDoneTasks = () => {
  if (tasks.length > 0) {
    tasks.forEach((item) => {
      item.display = '';
      if (item.completed === false) item.display = 'hidden';
    });
    typeTaskAll.classList.remove('type--selected');
    typeTaskActive.classList.remove('type--selected');
    typeTaskDone.classList.add('type--selected');
    inputTaskWrap.classList.add('new-task--hidden');
    fillToDoList();
  };
};

const searchSubStr = () => {
  let subStr = searchInput.value;
  if (typeTaskActive.matches('.type--selected')) {
    tasks.forEach((item) => {
      if (item.descr.toLowerCase().includes(subStr.toLowerCase()) && !item.completed) item.display = ''
      else item.display = 'hidden';
    });
  }
  else if (typeTaskDone.matches('.type--selected')) {
    tasks.forEach((item) => {
      if (item.descr.toLowerCase().includes(subStr.toLowerCase()) && item.completed) item.display = ''
      else item.display = 'hidden';
    });
  }
  else {
    tasks.forEach((item) => {
      if (!item.descr.toLowerCase().includes(subStr.toLowerCase())) item.display = 'hidden'
      else item.display = '';
    });
  };
  fillToDoList();
};
//document.addEventListener("DOMContentLoaded", viewAllTasks());
viewAllTasks();