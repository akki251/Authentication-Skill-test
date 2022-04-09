import { showAlert } from './toast.js';

const signinForm = document.querySelector('.signin-form');

signinForm.addEventListener('submit', async (e) => {
  console.log(signinForm);
  e.preventDefault();
  const email = signinForm?.querySelector('#email').value;
  const password = signinForm?.querySelector('#password').value;
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:8000/api/signin',
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      showAlert('signin success', 'success');
      setTimeout(() => {
        location.assign('/welcome');
      }, 3000);
    }
  } catch (error) {
    showAlert(error.response.data.message, 'error');
  }
});

const forgotForm = document.querySelector('.forgot-form');

// console.log(forgotForm);
forgotForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.querySelector('.forgot-email').value;

  try {
    const response = await axios({
      method: 'POST',
      url: '/api/forgot-password',
      data: { email },
    });
    if (response.data.status === 'success') {
      showAlert(
        'Password reset sent to mail, valid for only 10 mins',
        'success'
      );
    }
  } catch (error) {
    showAlert(error.response.data.message , 'error');
  }
});
