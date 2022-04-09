const dotenv = require('dotenv');
// dotenv config
dotenv.config({ path: './config.env' });
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./controllers/errorController');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const backendRoutes = require('./routes/apiRoutes.js');
const frontendRoutes = require('./routes/frontendRoutes');
// const authRoutes = require('./routes/authRoutes');
const passport = require('passport');
const cors = require('cors');

// require('./controllers/passport');

const express = require('express');

require('./controllers/passport')(passport);

const app = express();

//
// ────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: G L O B A L   M I D D L W A R E S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────
//
// cors handling
app.use(cors());
app.options('*', cors());

app.use(cookieParser());

app.use(express.static('public'));

app.use(expressLayouts);

//  view engine setup
app.set('layout', './layouts/base');
app.set('view engine', 'ejs');

// cookie and session config
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
    }),
  })
);

//  for parsing body data
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(express.json());

// for logging request on console
app.use(morgan('dev'));

// app.use('/', (req, res) => {
//   res.send('HOME PAGE');
// });

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
//   next();
// });

// route  /auth/google
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @route /auth/google/callback

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/error',
  }),
  (req, res) => {
    // console.log(req.user);
    res.redirect('/welcome');
  }
);

// logout user
// @route  /auth/logout

app.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});
// app.use('/auth', authRoutes);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use('/', frontendRoutes);
app.use('/api', backendRoutes);

//  global error handler
app.use(globalErrorHandler);

module.exports = app;
