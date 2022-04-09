const express = require('express');
const viewControllers = require('../controllers/viewControllers');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

router.use(
  catchAsync(async (req, res, next) => {
    let token = null;
    res.locals.user = null;
    res.locals.google = false;

    if (req.user) {
      res.locals.user = req.user;
      res.locals.google = true;
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
      return next();
    }

    const decoded = jwt.verify(token, process.env.SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next();
    }

    if (user.checkTokenExpiry(decoded.iat)) {
      return next();
    }

    //  attaching user in the req.user object
    res.locals.user = user;
    next();
  })
);

router.route('/').get((req, res) => {
  res.render('home', {
    title: 'home',
  });
});

router.route('/welcome').get(authControllers.protect, (req, res, next) => {
  res.render('welcome', {
    title: 'welcome',
  });
});

router.route('/signin').get((req, res) => {
  res.render('signin', {
    title: 'signin',
  });
});

router.route('/forgotPassword').get((req, res) => {
  res.render('forgotPassword', {
    title: 'forgotPassword',
  });
});

module.exports = router;
