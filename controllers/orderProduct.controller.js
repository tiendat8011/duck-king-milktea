const Order = require('../models/Order');
const Product = require('../models/Product');
const OrderProduct = require('../models/OrderProduct');
const asyncHandle = require('../middlewares/asyncHandle');

module.exports = {
    getAllOrderProducts: asyncHandle(async (req, res) => {
        const orderProducts = await OrderProduct.find();
        console.log(orderProducts);
    }),
};
