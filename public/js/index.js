import { showAlert } from './toast.js';

//  SIGNOUT
const signout = document.querySelector('.sign-out');

signout?.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/signout',
    });

    if (res.data.status === 'success') {
      showAlert('Signout Success', 'success');
      setInterval(() => {
        location.assign('/');
      }, 2000);
    }
  } catch (error) {}
});

// CHANGE PASSWORD WHILE LOGGED IN
const changeForm = document.querySelector('.change-password');

changeForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const currentPassword = document.querySelector(
    '#change-password-current'
  ).value;
  const newPassword = document.querySelector('#change-password-new').value;

  try {
    const res = await axios({
      method: 'POST',
      url: '/api/change-password',
      data: {
        currentPassword,
        newPassword,
      },
    });
    // console.log(res);
    if (res.data.status === 'success') {
      showAlert('Password Changed successfully', 'success');
    }
  } catch (error) {
    showAlert(error.response.data.message, 'success');
  }
});

// FORGOT PASSWORD
const resetForm = document.querySelector('.reset-password');

resetForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.querySelector('#email').value;
  const newPassword = document.querySelector('#change-password-current').value;

  try {
    const res = await axios({
      method: 'POST',
      url: '/api/newpassword',
      data: {
        email,
        newPassword,
      },
    });

    if (res.data.status === 'success') {
      showAlert('Password reset successfull', 'success');
    } else {
      showAlert(res.data.message, 'error');
    }
  } catch (error) {
    showAlert(error.response.data.message, 'error');
  }
});
