const jwt = require('jsonwebtoken');

const Order = require('../models/Order');
const User = require('../models/User');
const asyncHandle = require('../middlewares/asyncHandle');
const ErrorResponse = require('../common/ErrorResponse');

module.exports = {
    // [GET] /orders/admin
    getAllOrdersOfUsers: asyncHandle(async (req, res) => {
        const orders = await Order.find();
        return res.json(orders);
    }),

    // [GET] /orders/:userId
    getAllOrdersOfUserById: asyncHandle(async (req, res) => {
        const { userId: id } = req.params;
        const user = await User.findById(id);
        const orders = await Order.find({ user });
        return res.json(orders);
    }),

    //[POST] /orders/
    createOrder: asyncHandle(async (req, res, next) => {
        const token = req.signedCookies[process.env.LABEL_ACCESS_TOKEN];
        const reqBody = req.body;
        const order = {
            customer_address: reqBody.customer_address,
            phone_number: reqBody.phone_number,
            user: '',
            products: reqBody.products,
        };
        // jwt.verify(
        //     token,
        //     process.env.PRIVATE_KEY,
        //     async function (err, decoded) {
        //         if (err) return next(new ErrorResponse('Invalid token', 401));
        //         const user = await User.findOne({ username: decoded.username });
        //         await Order.create({
        //             ...order,
        //             user: user._id,
        //         });
        //         return res.send('Create order successfully');
        //     }
        // );
        await Order.create({
            ...order,
            user: '6269259730e47bd27ccb3a0b',
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

    // [DELETE] /orders/:orderId
    deleteOrderByOrderId: asyncHandle(async (req, res) => {
        const { orderId } = req.params;
        await Order.findByIdAndDelete(orderId);
        res.send('Delete successfully');
    }),
};
