const express = require('express');

const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const productRouter = express.Router();

productRouter
    .route('/')
    .get(authMiddleware.isAuthenticated, productController.getAllProducts);
productRouter
    .route('/create/admin')
    .get(
        authMiddleware.protect,
        authMiddleware.admin,
        authMiddleware.isAuthenticated,
        productController.createProductSite
    );

productRouter
    .route('/admin')
    .get(
        authMiddleware.protect,
        authMiddleware.admin,
        authMiddleware.isAuthenticated,
        productController.getAllProductsAdmin
    )
    .post(
        authMiddleware.protect,
        authMiddleware.admin,
        productController.createProduct
    );
productRouter
    .route('/admin/:id')
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

module.exports = productRouter;
