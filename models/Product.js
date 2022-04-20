const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Require name'],
            unique: true,
            trim: true,
        },
        price: {
            type: Number,
            trim: true,
            default: 0,
        },
        description: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
