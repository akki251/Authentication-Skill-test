const success = 'linear-gradient(315deg, #20bf55 0%, #01baef 74%';
const error = 'linear-gradient(315deg, #6b0f1a 0%, #b91372 74%)';

export const showAlert = (message, type) => {
  Toastify({
    text: message,
    duration: 2000,
    newWindow: true,
    close: true,
    gravity: 'top', // `top` or `bottom`
    position: 'center', // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover

    style: {
      background: type === 'success' ? success : error,
    },
  }).showToast();
};
