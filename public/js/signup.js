import { showAlert } from './toast.js';

const signupForm = document.querySelector('.signup-form');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = signupForm?.querySelector('#email').value;
  const password = signupForm?.querySelector('#password').value;
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/signup',
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      showAlert('Signup success', 'success');

      setTimeout(() => {
        location.assign('/signin');
      }, 3000);
    }
  } catch (error) {
    showAlert(error.response.data.message, 'error');
  }
});
