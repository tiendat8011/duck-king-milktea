const express = require('express');

const newsRouter = express.Router();

const newsController = require('../controllers/news.controller');
const authMiddleware = require('../middlewares/authMiddleware');
newsRouter
    .route('/')
    .get(authMiddleware.isAuthenticated, newsController.renderSite);

module.exports = newsRouter;
