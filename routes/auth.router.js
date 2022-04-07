const express = require('express');

const authController = require('../controllers/auth.controller');

const authRouter = express.Router();

authRouter
    .route('/login')
    .get(authController.loginSite)
    .post(authController.login);
authRouter.route('/register').get(authController.registerSite);
authRouter
    .route('/forget-password')
    .get(authController.forgetPasswordSite)
    .post(authController.forgetPassword);
authRouter
    .route('/change-password')
    .get(authController.changePasswordSite)
    .put(authController.changePassword);

module.exports = authRouter;
