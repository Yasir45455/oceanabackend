const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    guestId: { type: String, required: true, unique: true },
    products: [
        {
            product_ID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            gift: {
                type: String,
                default: ''
            },
            size: {
                type: String,
                default: ''
            },
            extras: [
                {
                    name: { type: String },
                    price: { type: Number }
                }
            ] ,
            total: {
                type: Number,  // Changed from String to Number
                default: 0
            }
        }
    ],
    sub_total: { type: Number, default: 0 }, // Changed from String to Number
});

const cartModel = mongoose.model('Cart', cartSchema);

module.exports = cartModel;