const express = require('express');

const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const productRouter = express.Router();

productRouter
    .route('/:id')
    .get(productController.getProduct)
    .put(authMiddleware.protect, productController.updateProductById)
    .delete(authMiddleware.protect, productController.deleteProductById);

productRouter
    .route('/')
    .get(productController.renderSite)
    .post(authMiddleware.protect, productController.createProduct);

module.exports = productRouter;
