import { getDataFromApi, addTaskToApi, deleteFromApi } from './data.js';

class PomodoroApp {
  constructor(options) {
    let { tableTbodySelector, taskFormSelector } = options;
    this.$tableTbody = document.querySelector(tableTbodySelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');
  }

  addTask(task) {
    addTaskToApi(task)
      .then((data) => data.json())
      .then((newTask) => {
        this.addTaskToTable(newTask);
        const $formButton = document.getElementById('form-button');
        $formButton.disabled = false;
        $formButton.innerHTML = 'Add Task';
      });
  }

  addTaskToTable(task, index) {
    const $newTaskEl = document.createElement('tr');
    const closeButtons = this.getCloseButtons();
    const newIndex = index ? index : closeButtons.length + 1;
    $newTaskEl.innerHTML = `<th scope="row">${newIndex}</th><td>${task.title}</td>
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

  handleDeleteTask() {
    const closeButtons = this.getCloseButtons();
    closeButtons.forEach((item) => {
      item.addEventListener('click', () => {
        deleteFromApi(item.id).then(() => location.reload());
      });
    });
  }

  init() {
    this.fillTasksTable();
    this.handleAddTask();
  }
}

export default PomodoroApp;
