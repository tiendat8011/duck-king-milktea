const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/user.controller');

const userRouter = express.Router();

userRouter
    .route('/')
    .get(authMiddleware.protect, userController.getAllUsersAndPosts);

userRouter
    .route('/:id')
    .get(userController.getUserAndPosts)
    .put(userController.updateUserById)
    .delete(userController.deleteUserById);

module.exports = userRouter;
