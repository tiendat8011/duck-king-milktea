const express = require('express');

const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const productRouter = express.Router();

productRouter
    .route('/:id')
    .get(productController.getProduct)
    .put(productController.updateProductById)
    .delete(productController.deleteProductById);

productRouter
    .route('/')
    .get(productController.getAllProducts)
    .post(productController.createProduct);

module.exports = productRouter;
