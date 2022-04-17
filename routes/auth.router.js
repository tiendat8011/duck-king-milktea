const express = require('express');

const authController = require('../controllers/auth.controller');

const authRouter = express.Router();

authRouter
    .route('/login')
    .get(authController.loginSite)
    .post(authController.login);
authRouter
    .route('/register')
    .get(authController.registerSite)
    .post(authController.createUser);
authRouter
    .route('/forget-password')
    .get(authController.forgetPasswordSite)
    .post(authController.forgetPassword);
authRouter
    .route('/reset-password-successfully')
    .get(authController.successfullyReset);
authRouter
    .route('/change-password')
    .get(authController.changePasswordSite)
    .put(authController.changePassword);

module.exports = authRouter;
