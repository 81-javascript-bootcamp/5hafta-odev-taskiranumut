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

  addTask(task) {
    addTaskToApi(task)
      .then((data) => data.json())
      .then((newTask) => {
        this.addTaskToTable(newTask);
        this.addTaskButtonActivated();
      });
  }

  addTaskToTable(task, index) {
    const $newTaskEl = document.createElement('tr');
    const newIndex = index ? index : this.getCloseButtons().length + 1;
    $newTaskEl.innerHTML = `<th class="index" scope="row">${newIndex}</th><td>${task.title}</td>
    <td><button type='button' class="close" id="${task.id}" aria-label="Close">X</button></td>`;
    this.$tableTbody.appendChild($newTaskEl);
    this.handleDeleteTask();
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
    });
  }

  getCloseButtons() {
    return document.querySelectorAll('button.close');
  }

  getTaskRowAndRemove(item) {
    const taskRow = item.parentNode.parentNode;
    taskRow.remove();
    this.findIndexAndFix();
  }

  findIndexAndFix() {
    const $thIndexs = document.querySelectorAll('th.index');
    $thIndexs.forEach((th, index) => {
      th.innerHTML = index + 1;
    });
  }

  handleDeleteTask() {
    const closeButtons = this.getCloseButtons();
    closeButtons.forEach((item) => {
      item.addEventListener('click', () => {
        deleteFromApi(item.id).then(() => this.getTaskRowAndRemove(item));
      });
    });
  }

  init() {
    this.fillTasksTable();
    this.handleAddTask();
  }
}

export default PomodoroApp;
