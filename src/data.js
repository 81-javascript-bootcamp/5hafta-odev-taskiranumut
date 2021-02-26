import { API_URL } from './constans.js';

export const getDataFromApi = () => {
  return fetch(API_URL)
    .then((data) => data.json())
    .then((data) => data);
};

export const addTaskToApi = (task) => {
  const $formButton = document.getElementById('form-button');
  $formButton.disabled = true;
  $formButton.innerHTML = `<div class="spinner-border spinner-border-sm text-light" role="status"></div>`;
  return fetch(API_URL, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
};

export const deleteFromApi = (taskId) => {
  return fetch(`${API_URL}/${taskId}`, {
    method: 'delete',
  });
};
