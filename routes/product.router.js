const express = require('express');

const productController = require('../controllers/product.controller');

const productRouter = express.Router();

productRouter.route('/').get(productController.renderSite);

module.exports = productRouter;
