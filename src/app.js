import { getDataFromApi, addTaskToApi, deleteFromApi } from './data.js';

class PomodoroApp {
  constructor(options) {
    let { tableTbodySelector, taskFormSelector } = options;
    this.$tableTbody = document.querySelector(tableTbodySelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');
  }

  addTaskButtonActivated() {
    const $formButton = document.getElementById('form-button');
    $formButton.disabled = false;
    $formButton.innerHTML = 'Add Task';
  }

  addTaskButtonDisabled() {
    const $formButton = document.getElementById('form-button');
    $formButton.disabled = true;
    $formButton.innerHTML = `<div class="spinner-border spinner-border-sm text-light" role="status"></div>`;
  }

  addTask(task) {
    this.addTaskButtonDisabled();
    addTaskToApi(task)
      .then((data) => data.json())
      .then((newTask) => {
        this.addTaskToTable(newTask);
        this.addTaskButtonActivated();
      });
  }

  addTaskToTable(task, index) {
    const $newTaskEl = document.createElement('tr');
    const $allCloseButtonsArr = document.querySelectorAll('button.close');
    const newIndex = index ? index : $allCloseButtonsArr.length + 1;
    $newTaskEl.innerHTML = `<th class="index" scope="row">${newIndex}</th><td>${task.title}</td>
    <td><button type='button' class="close" id="${task.id}" aria-label="Close">X</button></td>`;
    this.$tableTbody.appendChild($newTaskEl);
    this.$taskFormInput.value = '';
  }

  handleAddTask() {
    this.$taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.$taskFormInput.value) {
        const task = { title: this.$taskFormInput.value };
        this.addTask(task);
      }
    });
  }

  fillTasksTable() {
    getDataFromApi().then((currentTasks) => {
      currentTasks.forEach((task, index) => {
        this.addTaskToTable(task, index + 1);
      });
      this.handleDeleteTask();
    });
  }

  getTaskRowAndRemove(item) {
    const $taskRowEl = item.parentNode.parentNode;
    $taskRowEl.remove();
    this.findIndexAndFix();
  }

  findIndexAndFix() {
    const $thIndexsArr = document.querySelectorAll('th.index');
    $thIndexsArr.forEach((th, index) => {
      th.innerHTML = index + 1;
    });
  }

  handleDeleteTask() {
    const $closeButtonsDiv = document.getElementById('buttons');
    $closeButtonsDiv.addEventListener('click', (event) => {
      if (event.target.className === 'close') {
        const closeButtonId = event.target.id;
        const $closeButtonEl = document.getElementById(closeButtonId);
        $closeButtonEl.disabled = true;
        deleteFromApi(closeButtonId).then(() => {
          this.getTaskRowAndRemove($closeButtonEl);
          $closeButtonEl.disabled = false;
        });
      }
    });
  }

  init() {
    this.fillTasksTable();
    this.handleAddTask();
  }
}

export default PomodoroApp;
