const express = require('express');

const orderController = require('../controllers/order.controller');

const orderRouter = express.Router();

orderRouter.route('/admin/:userId').get(orderController.getAllOrdersOfUserById);

orderRouter.route('/admin').get(orderController.getAllOrdersOfUsers);

orderRouter
    .route('/:orderId')
    .put(orderController.updateOrderByOrderId)
    .delete(orderController.deleteOrderByOrderId);

orderRouter
    .route('/')
    .get(orderController.getAllOrdersOfUserById)
    .post(orderController.createOrder);

module.exports = orderRouter;
