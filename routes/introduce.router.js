const express = require('express');

const introduceController = require('../controllers/introduce.controller');

const introduceRouter = express.Router();

introduceRouter.route('/').get(introduceController.renderSite);

module.exports = introduceRouter;
