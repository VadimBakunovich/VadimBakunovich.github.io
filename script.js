const inputTask = document.getElementById('new-task'),
      inputTaskWrap = document.getElementById('input-task-wrapper'),
      tasksWrapper = document.getElementById('task-list'),
      typeTaskAll = document.getElementById('all'),
      typeTaskActive = document.getElementById('active'),
      typeTaskDone = document.getElementById('done'),
      searchInput = document.getElementById('search'),
      tabs = document.querySelectorAll('.type'),
      content = document.querySelector('.content');

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

const createTemplate = (task, index) =>
  `
    <li ${task.display} class="task">
      <p onclick="completeTask(${index})" class="task__text ${task.completed ? 'task__text--completed' : ''} ${task.important ? 'task__text--important' : ''}">${task.descr}</p>
      <div class="task__btns-wrapper">
        <button ${task.btnImportant} onclick="markTaskImportant(${index})" class="task__btn-important ${task.important ? 'task__btn-important--true' : 'task__btn-important--false'}">${task.importantBtnText}</button>
        <button onclick="delTask(${index})" class="task__btn-del" title="permanently delete"></button>
      </div>
    </li>
  `;

const fillToDoList = () => {
  tasksWrapper.innerHTML = "";
  if (tasks.length) {
    tasks.forEach((item, index) => tasksWrapper.innerHTML += createTemplate(item, index));
    toDoListItems = document.querySelectorAll('.task');
  }
};

const updLocalStor = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const completeTask = (index) => {
  tasks[index].completed = !tasks[index].completed;
  tasks[index].completed ? tasks[index].btnImportant = 'hidden' : tasks[index].btnImportant = '';
  if (tasks[index].completed && typeTaskActive.matches('.type--selected')) tasks[index].display = 'hidden';
  if (!tasks[index].completed && typeTaskDone.matches('.type--selected')) tasks[index].display = 'hidden';
  updLocalStor();
  fillToDoList();
};

const markTaskImportant = (index) => {
  tasks[index].important = !tasks[index].important;
  if (tasks[index].important) tasks[index].importantBtnText = 'NOT IMPORTANT';
  else tasks[index].importantBtnText = 'MARK IMPORTANT';
  updLocalStor();
  fillToDoList();
};

const delTask = (index) => {
  tasks.splice(index, 1);
  updLocalStor();
  if (!tasks.length) {
    document.querySelector('.type--selected').classList.remove('type--selected');
    searchInput.disabled = true;
  };
  fillToDoList();
};

const viewAllTasks = () => {
  typeTaskAll.classList.add('type--selected');
  tasks.forEach((item) => item.display = '');
  fillToDoList();
  searchInput.value = '';
};

const viewActiveTasks = () => {
  typeTaskActive.classList.add('type--selected');
  tasks.forEach((item) => {
    item.display = '';
    if (item.completed) item.display = 'hidden';
  });
  fillToDoList();
  searchInput.value = '';
};

const viewDoneTasks = () => {
  typeTaskDone.classList.add('type--selected');
  tasks.forEach((item) => {
    item.display = '';
    if (!item.completed) item.display = 'hidden';
  });
  fillToDoList();
  searchInput.value = '';
};

const taskSorting = (target) => {
  if (target.id === 'all') viewAllTasks();
  else if (target.id === 'active') viewActiveTasks();
  else if (target.id === 'done') viewDoneTasks();
};

const tabsHandler = (target) => {
  if (tasks.length) {
    for (tab of tabs) {
      tab.id === target.id ? taskSorting(target) : tab.classList.remove('type--selected');
      if (tab.id === target.id && tab.id === 'done') inputTaskWrap.classList.add('new-task--hidden');
      else inputTaskWrap.classList.remove('new-task--hidden');
    }
  }
};

const btnAddTaskHandler = () => {
  if (inputTask.value.length) {
    tasks.unshift(new Task(inputTask.value));
    updLocalStor();
    typeTaskActive.matches('.type--selected') ? viewActiveTasks() : viewAllTasks();
    inputTask.value = '';
    searchInput.disabled = false;
  }
};

content.addEventListener('click', (event) => {
  let target = event.target;
  if (target.className === 'type') tabsHandler(target);
  if (target.className === 'btn-add-task') btnAddTaskHandler();
});

inputTask.addEventListener('keydown', function(event) {
  if (event.key === "Enter") {
    if (inputTask.value.length) {
      tasks.unshift(new Task(inputTask.value));
      updLocalStor();
      typeTaskActive.matches('.type--selected') ? viewActiveTasks() : viewAllTasks();
      inputTask.value = '';
      event.preventDefault();
      searchInput.disabled = false;
    } else event.preventDefault();
  }
});

const searchSubStr = () => {
  let subStr = searchInput.value;
  if (typeTaskActive.matches('.type--selected')) {
    tasks.forEach((item) => {
      item.descr.toLowerCase().includes(subStr.toLowerCase()) && !item.completed ? item.display = '' : item.display = 'hidden';
    });
  } else if (typeTaskDone.matches('.type--selected')) {
      tasks.forEach((item) => {
        item.descr.toLowerCase().includes(subStr.toLowerCase()) && item.completed ? item.display = '' : item.display = 'hidden';
    });
  } else {
    tasks.forEach((item) => {
      !item.descr.toLowerCase().includes(subStr.toLowerCase()) ? item.display = 'hidden' : item.display = '';
    });
  };
  fillToDoList();
};

document.addEventListener("DOMContentLoaded", () => {
  if (tasks.length) {
    typeTaskAll.classList.add('type--selected');
    tasks.forEach((item) => item.display = '');
    fillToDoList();
  } else searchInput.disabled = true;
});