const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/user.controller');

const userRouter = express.Router();

userRouter.use(authMiddleware.protect);

userRouter
    .route('/admin')
    .get(
        authMiddleware.isAuthenticated,
        authMiddleware.admin,
        userController.getAllUsers
    );
userRouter
    .route('/:id')
    .get(userController.getUser)
    .put(authMiddleware.protect, userController.updateUserById)
    .delete(authMiddleware.protect, userController.deleteUserById);

module.exports = userRouter;
