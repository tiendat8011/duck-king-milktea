const express = require('express');

const homeController = require('../controllers/home.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const homeRouter = express.Router();

homeRouter
    .route('/')
    .get(authMiddleware.isAuthenticated, homeController.renderSite);

module.exports = homeRouter;
