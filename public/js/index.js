import 'core-js';
import 'regenerator-runtime/runtime';

import { login } from './login';
import { displayMap } from './leaflet';

// DOM ELEMENTS
const leaflet = document.getElementById('map');
const loginForm = document.querySelector('.form');

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
