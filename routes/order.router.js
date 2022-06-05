const express = require('express');

const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const orderValidation = require('../validation/order.validation');

const orderRouter = express.Router();

orderRouter
    .route('/admin/:userId')
    .get(
        authMiddleware.protect,
        authMiddleware.isAuthenticated,
        authMiddleware.admin,
        orderController.getAllOrdersOfUserByIdAdmin
    );

orderRouter
    .route('/admin')
    .get(
        authMiddleware.protect,
        authMiddleware.isAuthenticated,
        authMiddleware.admin,
        orderController.getAllOrdersOfUsers
    );

orderRouter
    .route('/deleted/admin')
    .get(
        authMiddleware.protect,
        authMiddleware.isAuthenticated,
        authMiddleware.admin,
        orderController.getAllDeletedOrders
    );

orderRouter
    .route('/trash/:orderId')
    .delete(
        authMiddleware.protect,
        authMiddleware.admin,
        orderController.moveOrderToTrashByOrderId
    );

orderRouter
    .route('/trash/:orderId/restore')
    .patch(
        authMiddleware.protect,
        authMiddleware.admin,
        orderController.restoreOrderByOrderId
    );

orderRouter
    .route('/:orderId')
    .put(
        authMiddleware.protect,
        authMiddleware.admin,
        orderController.updateOrderByOrderId
    )
    .delete(
        authMiddleware.protect,
        authMiddleware.admin,
        orderController.deleteOrderByOrderId
    );

orderRouter
    .route('/:userId')
    .get(
        authMiddleware.protect,
        authMiddleware.authUser,
        orderController.getAllOrdersOfUserById
    )

    .post(
        authMiddleware.protect,
        authMiddleware.authUser,
        validate(orderValidation.createOrder),
        orderController.createOrder
    );

module.exports = orderRouter;
