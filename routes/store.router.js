const express = require('express');
const storeRouter = express.Router();
const storeController = require('../controllers/store.controller');

storeRouter.route('/').get(storeController.renderSite);

module.exports = storeRouter;
