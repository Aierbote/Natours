const hideAlert = () => {
  const el = document.querySelector('.alert');
  // const el = document.getElementsByClassName('alert')[0];
  if (el) el.parentElement.removeChild(el);
};

// type is either 'success' or 'error'
export const showAlert = (type, msg) => {
  hideAlert();

  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  window.setTimeout(hideAlert, 5000);
};