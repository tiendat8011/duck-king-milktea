const jwt = require('jsonwebtoken');

const Order = require('../models/Order');
const User = require('../models/User');
const asyncHandle = require('../middlewares/asyncHandle');
const ErrorResponse = require('../common/ErrorResponse');

module.exports = {
    // [GET] /orders/admin
    getAllOrdersOfUsers: asyncHandle(async (req, res) => {
        const user = await User.findOne({ username: res.locals.username });
        const orders = await Order.find().populate('user').populate('products');
        return res.render('admin/orders', {
            orders,
            userFName: user?.full_name,
            userRole: user?.role,
            userId: user?.id,
        });
    }),

    // [GET] /orders/deleted/admin
    getAllDeletedOrders: asyncHandle(async (req, res) => {
        const user = await User.findOne({ username: res.locals.username });
        const orders = await Order.findDeleted()
            .populate('user')
            .populate('products');
        return res.render('admin/orders/deleted', {
            orders,
            userFName: user?.full_name,
            userRole: user?.role,
            userId: user?.id,
        });
    }),

    // [GET] /orders/admin/:userId
    getAllOrdersOfUserByIdAdmin: asyncHandle(async (req, res) => {
        const user = await User.findOne({ username: res.locals.username });
        const { userId } = req.params;
        const owner = await User.findById(userId);
        const orders = await Order.find({ user: userId })
            .populate('user')
            .populate('products');
        return res.render('admin/orders/userorders', {
            owner,
            orders,
            userId,
            userFName: user?.full_name,
            userRole: user?.role,
        });
    }),

    // [GET] /orders/:userId
    getAllOrdersOfUserById: asyncHandle(async (req, res) => {
        const { userId } = req.params;
        const user = await User.findById(userId);
        const orders = await Order.find({ user: userId })
            .populate('user')
            .populate('products');
        return res.render('myorders', {
            orders,
            userId,
            userFName: user?.full_name,
            userRole: user?.role,
        });
    }),

    //[POST] /orders/:userId
    createOrder: asyncHandle(async (req, res, next) => {
        const { userId } = req.params;
        const token = req.signedCookies[process.env.LABEL_ACCESS_TOKEN];
        const reqBody = req.body;
        const order = {
            customer_address: reqBody.customer_address,
            phone_number: reqBody.phone_number,
            user: '',
            products: reqBody.products,
        };
        await Order.create({
            ...order,
            user: userId,
        });
        return res.send('Create order successfully');
    }),

    //[PUT] /orders/:orderId
    updateOrderByOrderId: asyncHandle(async (req, res) => {
        const reqBody = req.body;
        const { orderId } = req.params;
        const order = {
            customer_address: reqBody.customer_address,
            phone_number: reqBody.phone_number,
            products: reqBody.products,
        };
        await Order.findByIdAndUpdate(orderId, order);
        return res.send('Update successfully');
    }),

    // [PATCH] /orders/trash/:orderId/restore
    restoreOrderByOrderId: asyncHandle(async (req, res) => {
        const { orderId } = req.params;
        await Order.restore({ _id: orderId });
        res.send('Restore successfully');
    }),

    // [DELETE] /orders/:orderId
    deleteOrderByOrderId: asyncHandle(async (req, res) => {
        const { orderId } = req.params;
        await Order.findByIdAndDelete(orderId);
        res.send('Delete successfully');
    }),

    // [DELETE] /orders/trash/:orderId
    moveOrderToTrashByOrderId: asyncHandle(async (req, res) => {
        await Order.delete({ _id: req.params.orderId });
        res.send('Delete successfully');
    }),
};
