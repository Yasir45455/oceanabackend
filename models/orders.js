const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    guest_id: { type: String, required: true },
    address_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
  
    total_with_tip :
    {
        type:String,
    },
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
        }
    ]
}, {
    timestamps: true
});

const OrderModel = mongoose.model('Order', orderSchema);

module.exports = OrderModel;
