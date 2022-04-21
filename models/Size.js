const mongoose = require('mongoose');

const User = require('./User');

const sizeSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
        enum: ['S', 'M', 'L'],
    },
    price: {
        type: Number,
    },
});

const Size = mongoose.model('Size', sizeSchema);
module.exports = Size;
