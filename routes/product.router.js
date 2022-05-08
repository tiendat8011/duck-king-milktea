const express = require('express');

const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const productRouter = express.Router();

productRouter
    .route('/admin')
    .get(
        authMiddleware.protect,
        authMiddleware.admin,
        authMiddleware.isAuthenticated,
        productController.getAllProducts
    )
    .post(
        authMiddleware.protect,
        authMiddleware.admin,
        productController.createProduct
    )
    .put(
        authMiddleware.protect,
        authMiddleware.admin,
        productController.updateProductById
    )
    .delete(
        authMiddleware.protect,
        authMiddleware.admin,
        productController.deleteProductById
    );

productRouter.route('/:id').get(productController.getProduct);

productRouter
    .route('/')
    .get(authMiddleware.isAuthenticated, productController.getAllProducts);

module.exports = productRouter;
