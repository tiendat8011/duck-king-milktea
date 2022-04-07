const express = require('express');

const franchiseController = require('../controllers/franchise.controller');

const franchiseRouter = express.Router();

franchiseRouter.route('/').get(franchiseController.renderSite);

module.exports = franchiseRouter;
