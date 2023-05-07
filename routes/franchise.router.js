const express = require('express');

const franchiseController = require('../controllers/franchise.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const franchiseRouter = express.Router();

franchiseRouter
  .route('/')
  .get(authMiddleware.isAuthenticated, franchiseController.renderSite);

module.exports = franchiseRouter;
