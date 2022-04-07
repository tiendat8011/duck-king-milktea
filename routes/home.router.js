const express = require('express');

const homeController = require('../controllers/home.controller');

const homeRouter = express.Router();

homeRouter.route('/').get(homeController.renderSite);

module.exports = homeRouter;
