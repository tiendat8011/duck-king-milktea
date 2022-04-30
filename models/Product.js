const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        image: {},
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
            default: '',
        },
        category: {
            type: String,
            trim: true,
        },
        size: { type: String, enum: ['M', 'L'], default: 'M' },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
