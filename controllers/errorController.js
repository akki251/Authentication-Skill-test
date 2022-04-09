module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // for creating readable error

  // for password validation
  if (err.errors?.password) {
    err.message = 'Password length must be atleast 8';
  }

  // for duplicate entries
  if (err.code === 11000) {
    err.message = 'Email already exists';
  }

  if (err.name === 'JsonWebTokenError') {
    err.message = 'Invalid token, Please login again';
  }

  return res.status(err.statusCode).json({
    // error: err,
    status: err.status,
    message: err.message,
  });
};
