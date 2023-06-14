const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/user.controller');

const userRouter = express.Router();

userRouter
  .route('/admin')
  .get(
    authMiddleware.protect,
    authMiddleware.isAuthenticated,
    authMiddleware.admin,
    userController.getAllUsers
  );

userRouter
  .route('/change-password')
  .post(
    authMiddleware.protect,
    authMiddleware.isAuthenticated,
    userController.changePassword
  );

userRouter
  .route('/:id')
  .get(authMiddleware.protect, userController.getUser)
  .put(authMiddleware.protect, userController.updateUserById)
  .delete(authMiddleware.protect, userController.deleteUserById);

module.exports = userRouter;
