const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String},
  price: { type: Number },
  small_price: { type: Number },   
  medium_price: { type: Number },  
  large_price: { type: Number },
  category: { type: String },
  subCategory: { type: String },
  shortDescription: { type: String },
  gifts: [{ type: String }],
  extra: [{ 
    name: { type: String }, 
    price: { type: String } 
  }]  
}, {
  timestamps: true
});

module.exports = mongoose.model('Products', productSchema);

