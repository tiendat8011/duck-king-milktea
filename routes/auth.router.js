const express = require('express');

const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const authValidation = require('../validation/auth.validation');

const authRouter = express.Router();

authRouter
  .route('/login')
  .get(authController.loginSite)
  .post(validate(authValidation.login), authController.login);
authRouter.route('/logout').get(authController.logout);
authRouter
  .route('/register')
  .get(authController.registerSite)
  .post(validate(authValidation.register), authController.createUser);
authRouter
  .route('/forget-password')
  .get(authController.forgetPasswordSite)
  .post(validate(authValidation.forgetPassword), authController.forgetPassword);
authRouter
  .route('/reset-password-successfully')
  .get(authController.successfullyReset);
authRouter
  .route('/change-password')
  .get(authController.changePasswordSite)
  .put(validate(authValidation.resetPassword), authController.changePassword);

module.exports = authRouter;
