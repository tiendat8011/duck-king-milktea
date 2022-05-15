const express = require('express');

const franchiseController = require('../controllers/franchise.controller');
const authMiddelware = require('../middlewares/authMiddleware');

const franchiseRouter = express.Router();

franchiseRouter
    .route('/')
    .get(authMiddelware.isAuthenticated, franchiseController.renderSite);

module.exports = franchiseRouter;
