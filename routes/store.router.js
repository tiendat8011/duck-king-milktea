const express = require('express');
const storeRouter = express.Router();
const storeController = require('../controllers/store.controller');
const authMiddleware = require('../middlewares/authMiddleware');

storeRouter
    .route('/')
    .get(authMiddleware.isAuthenticated, storeController.renderSite);

module.exports = storeRouter;
