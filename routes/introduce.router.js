const express = require('express');

const introduceController = require('../controllers/introduce.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const introduceRouter = express.Router();

introduceRouter
    .route('/')
    .get(authMiddleware.isAuthenticated, introduceController.renderSite);

module.exports = introduceRouter;
