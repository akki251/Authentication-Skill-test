// THIS is shorthand apperror class for creating error 
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'error' : 'fail';
  }
}

module.exports = AppError;
