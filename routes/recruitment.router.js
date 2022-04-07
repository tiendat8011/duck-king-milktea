const express = require('express');

const recruitmentRouter = express.Router();

const recruitmentController = require('../controllers/recruitment.controller');

recruitmentRouter.route('/').get(recruitmentController.renderSite);

module.exports = recruitmentRouter;
