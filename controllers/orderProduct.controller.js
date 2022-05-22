const Order = require('../models/Order');
const Product = require('../models/Product');
const OrderProduct = require('../models/OrderProduct');
const asyncHandle = require('../middlewares/asyncHandle');

module.exports = {
    // [GET] /order-product
    getAllOrderProducts: asyncHandle(async (req, res) => {
        const orderProducts = await OrderProduct.find().populate('product');
        res.send(orderProducts);
    }),

    // [POST] /order-product
    createOrderProduct: asyncHandle(async (req, res) => {
        const data = req.body;
        const oP = await OrderProduct.create(data);
        res.status(200).json(oP);
    }),

    // [PUT] /order-product/:id
    updateOrderProduct: asyncHandle(async (req, res) => {
        const { size, quantity } = req.body;
        const { id } = req.params;
        await OrderProduct.findByIdAndUpdate(id, { size, quantity });
        res.status(200).send('successful');
    }),
};
