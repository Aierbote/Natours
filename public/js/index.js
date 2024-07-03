import 'core-js';
import 'regenerator-runtime/runtime';

import { login, logout } from './login';
import { displayMap } from './leaflet';
import { updateSettings } from './updateSettings';

// DOM ELEMENTS
const leaflet = document.getElementById('map');
const loginForm = document.querySelector('.form--login ');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

// DELEGATION
if (leaflet) {
  const locations = JSON.parse(leaflet.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    console.log('try to make login work again');

    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) {
  console.log(logOutBtn);
  logOutBtn.addEventListener('click', logout);
}

if (userDataForm) {
  const photoElem = document.getElementById('photo');

  photoElem.addEventListener('change', (e) => {
    const [newFile] = e.target.files;

    console.log(newFile);

    if (newFile && newFile.type.startsWith('image')) {
      const formUserPhoto = document.querySelector('.form__user-photo');
      formUserPhoto.src = URL.createObjectURL(newFile);
    }
  });

  userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('btn--saveSettings').textContent = 'Updating...';

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', photoElem.files[0]);

    await updateSettings(form, 'data');

    document.getElementById('btn--saveSettings').textContent = 'Save Settings';
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
