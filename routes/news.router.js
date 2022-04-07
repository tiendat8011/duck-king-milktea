const express = require('express');

const newsRouter = express.Router();

const newsController = require('../controllers/news.controller');

newsRouter.route('/').get(newsController.renderSite);

module.exports = newsRouter;
