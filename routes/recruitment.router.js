const express = require('express');

const recruitmentRouter = express.Router();

const recruitmentController = require('../controllers/recruitment.controller');
const authMiddleware = require('../middlewares/authMiddleware');

recruitmentRouter
    .route('/')
    .get(authMiddleware.isAuthenticated, recruitmentController.renderSite);

module.exports = recruitmentRouter;
