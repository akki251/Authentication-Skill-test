const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendMail = require('../utils/mail');

const createToken = (id) => {
  // creating jwt token from payload as user id
  return jwt.sign({ id: id }, process.env.SECRET, {
    expiresIn: '1h',
  });
};

const SendToken = (req, res, user, status) => {
  const token = createToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 60 * 60 * 1000),
    httpOnly: true,
  };

  // setting jwt in cookie
  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;
  user.passwordUpdatedAt = undefined;

  res.status(status).json({
    status: 'success',
    token,
    data: user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email) || !password) {
    return next(new appError('Please enter valid credentials', '400'));
  }

  const user = await User.create({ email, password });

  user.password = undefined;
  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email) || !password) {
    return next(new appError('Please enter valid credentials', '400'));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.verifyPassword(password, user.password))) {
    return next(new appError('Invalid email or password', '400'));
  }
  //creating jwt token
  SendToken(req, res, user, 200);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token = null;

  if (req.user) {
    return next();
  }

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new appError('Please login to continue', 401));
  }

  const decoded = jwt.verify(token, process.env.SECRET);

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new appError('Invalid token, Please login again', 401));
  }
  // console.log(user.passwordUpdatedAt);
  // console.log(user);
  if (user.checkTokenExpiry(decoded.iat)) {
    return next(
      new appError(
        'Password changed after token issued,Please login again',
        401
      )
    );
  }

  //  attaching user in the req.user object
  req.user = user;
  next();
});

exports.signout = catchAsync(async (req, res, next) => {
  // deleting cookie name jwt
  res.clearCookie('jwt');
  req.logout();

  res.status(200).json({
    status: 'success',
    message: 'Signout success',
  });
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // taking user object from req.user
  const user = req.user;

  // getting user from db
  const userInDb = await User.findById(user._id).select('+password');

  //  checking currentPassword if it is correct or not
  if (!(await userInDb.verifyPassword(currentPassword, userInDb.password))) {
    return next(new appError('Incorrect current password', 401));
  }

  //  updating password
  userInDb.password = newPassword;

  // saving  in db
  userInDb.passwordUpdatedAt = Date.now() - 5000;

  await userInDb.save();

  SendToken(req, res, userInDb, 200);
});

const crypto = require('crypto');

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new appError('No user exists with this email', 404));
  }

  // generating reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // encrypting and storing encrypted version in db
  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // encrypted reset token expires after 10 mins
  user.passwordTokenExpires = Date.now() + 10 * 60 * 1000;

  await user.save();

  sendMail(
    user.email,
    `https://authentication-test-skill.herokuapp.com/api/forgot-password/${resetToken}`
  );

  res.status(200).json({
    status: 'success',
    url: `https://authentication-test-skill.herokuapp.com/api/forgot-password/${resetToken}`,
  });
});

exports.forgotPasswordToken = catchAsync(async (req, res, next) => {
  const token = req.params.token;

  // console.log(token);
  const encryptedPasswordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: encryptedPasswordResetToken,
    passwordTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new appError(
        'Invalid forgot password token,Please regenerate a fresh token'
      )
    );
  }

  res.locals.email = user.email;
  res.locals.user = null;
  next();
});

exports.createNewPassword = catchAsync(async (req, res, next) => {
  const { email, newPassword } = req.body;

  const user = await User.findOne({
    email,
    passwordTokenExpires: { $gt: Date.now() },
  }).select('+password');

  if (!user) {
    return next(
      new appError(
        'Password reset token is not valid,Please regenerate new one'
      )
    );
  }

  console.log(user);
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    user,
    message: 'Password reset successfully',
  });
});
