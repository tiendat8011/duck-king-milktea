const mongoose = require('mongoose');

const Product = require('./Product');
const Order = require('./Order');

const orderProductSchema = mongoose.Schema(
    {
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be larger than 0'],
        },
        product: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Product',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const OrderProduct = mongoose.model('OrderProduct', orderProductSchema);

module.exports = OrderProduct;
