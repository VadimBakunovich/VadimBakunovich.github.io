const addTaskBtn = document.getElementById('add-task-btn'),
      inputTask = document.getElementById('new-task'),
      inputTaskWrap = document.getElementById('input-task-wrapper'),
      tasksWrapper = document.getElementById('task-list'),
      allButtonsImportant = document.querySelectorAll('.task__btn-important'),
      typeTaskAll = document.getElementById('all'),
      typeTaskActive = document.getElementById('active'),
      typeTaskDone = document.getElementById('done'),
      searchInput = document.getElementById('search');
// Объявляем массив объектов(наши задачи)
let tasks = [];
// При загрузке страницы проверяем, если массив существует в localStorage, то заполняем его элементами наш tasks
!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'));
// Объявляем массив, элементами которого будут DOM-элементы с классом '.task'
let toDoListItems = [];
// Объявляем функцию-конструктор объекта(нашей задачи)
function Task(descr) {
  this.descr = descr;
  this.completed = false;
  this.important = false;
  this.btnImportant = '';
  this.importantBtnText = 'MARK IMPORTANT';
  this.display = '';
};
// Объявляем функцию создания шаблона нашей задачи в html
// Используем шаблонные литералы и интерполяцию выражений
const createTemplate = (task, index) => {
  return `
    <li ${task.display} class="task">
      <p onclick="completeTask(${index})" class="task__text ${task.completed ? 'task__text--completed' : ''} ${task.important ? 'task__text--important' : ''}">${task.descr}</p>
      <div class="task__btns-wrapper">
        <button type="button" ${task.btnImportant} onclick="markTaskImportant(${index})" class="task__btn-important ${task.important ? 'task__btn-important--true' : 'task__btn-important--false'}">${task.importantBtnText}</button>
        <button type="button" onclick="delTask(${index})"class="task__btn-del"></button>
      </div>
    </li>
  `
};
// Объявляем функцию наполнения html-страницы нашими задачами
const fillToDoList = () => {
  tasksWrapper.innerHTML = "";
  if (tasks.length > 0) {
    tasks.forEach((item, index) => {
      tasksWrapper.innerHTML += createTemplate(item, index);
    });
    toDoListItems = document.querySelectorAll('.task');
  };
};
// Объявляем функцию обновления LocalStorage
const updLocalStor = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};
// С помощью метода addEventListener() добаляем текст нашей задачи на страницу (по кнопке "ADD")
addTaskBtn.addEventListener('click', () => {
  if (inputTask.value.length != 0) {
    tasks.push(new Task(inputTask.value));
    updLocalStor();
    if (typeTaskActive.matches('.type--selected')) viewActiveTasks()
    else viewAllTasks();
    inputTask.value = '';
    searchInput.disabled = false;
  };
});
// С помощью метода addEventListener() добаляем текст нашей задачи на страницу (по кнопке "Enter")
inputTask.addEventListener('keydown', function(event) {
  if (event.key === "Enter") {
    if (inputTask.value.length != 0) {
      tasks.push(new Task(inputTask.value));
      updLocalStor();
      if (typeTaskActive.matches('.type--selected')) viewActiveTasks()
      else viewAllTasks();
      inputTask.value = '';
      event.preventDefault();
      searchInput.disabled = false;
    };
  };
});
// Объявляем функцию-обработчик, когда задача выполнена
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
// Объявляем функцию-обработчик, когда меняется важность задачи
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
// Объявляем функцию-обработчик, когда задача удаляется
const delTask = (index) => {
  tasks.splice(index, 1);
  updLocalStor();
  if (tasks.length == 0) {
    typeTaskAll.classList.remove('type--selected');
    typeTaskActive.classList.remove('type--selected');
    typeTaskDone.classList.remove('type--selected');
    inputTaskWrap.classList.remove('new-task--hidden');
    searchInput.disabled = true;
  };
  fillToDoList();
};
// Объявляем функцию отображения всех задач
const viewAllTasks = () => {
  if (tasks.length > 0) {
    tasks.forEach((item) => item.display = '');
    typeTaskAll.classList.add('type--selected');
    typeTaskActive.classList.remove('type--selected');
    typeTaskDone.classList.remove('type--selected');
    inputTaskWrap.classList.remove('new-task--hidden');
    fillToDoList();
  }
  else searchInput.disabled = true;
  searchInput.value = '';
};
// Объявляем функцию отображения активных задач
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
  searchInput.value = '';
};
// Объявляем функцию отображения выполненных задач
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
  searchInput.value = '';
};
// Объявляем функцию поиска в задачах
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
// Вызываем функцию отображения всех задач на странице
viewAllTasks();