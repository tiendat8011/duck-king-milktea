const express = require('express');

const userController = require('../controllers/user.controller');

const userRouter = express.Router();

userRouter
    .route('/')
    .get(userController.getAllUsersAndPosts)
    .post(userController.createUser);

userRouter
    .route('/:id')
    .get(userController.getUserAndPosts)
    .put(userController.updateUserById)
    .delete(userController.deleteUserById);

module.exports = userRouter;
