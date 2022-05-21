const mongoose = require('mongoose');

const Product = require('./Product');
const Order = require('./Order');

const orderProductSchema = mongoose.Schema(
    {
        quantity: {
            type: Number,
            min: [1, 'Quantity must be larger than 0'],
            default: 1,
        },
        product: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Product',
            required: true,
        },
        size: { type: String, enum: ['M', 'L'], default: 'M' },
    },
    {
        timestamps: true,
    }
);

const OrderProduct = mongoose.model('OrderProduct', orderProductSchema);

module.exports = OrderProduct;
