const express = require('express');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

// router.use('/', (req, res) => {
//   res.send('backend');
// });

router.route('/signup').post(authControllers.signup);
router.route('/signin').post(authControllers.signin);
router.route('/signout').post(authControllers.signout);
router.route('/forgot-password').post(authControllers.forgotPassword);
router
  .route('/forgot-password/:token')
  .get(authControllers.forgotPasswordToken, (req, res) => {
    res.render('forgotpassword', {
      title: 'forgot--Password',
    });
  });
router.route('/newpassword').post(authControllers.createNewPassword);
router
  .route('/change-password')
  .post(authControllers.protect, authControllers.changePassword);
module.exports = router;
