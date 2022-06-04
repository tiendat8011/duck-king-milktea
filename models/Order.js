const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const OrderProduct = require('./OrderProduct');

const orderSchema = mongoose.Schema(
    {
        customer_address: {
            type: String,
            required: true,
            trim: true,
        },
        phone_number: {
            type: String,
            trim: true,
            required: true,
        },
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        products: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'OrderProduct',
                required: true,
            },
        ],
        note: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

orderSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
