const AddressModel = require('../models/address');
const OrderModel = require('../models/orders');
const ProductModel = require('../models/products');
const Cart = require("../models/cart");

require('dotenv').config();
const { validationResult } = require("express-validator");
var mongoose = require('mongoose');
const createOrder = async (req, res) => {

    const {guest_id, address_id, products, total_with_tip } = req.body;
    try {
        // Create the order
        const newOrder = new OrderModel({
            guest_id,
            address_id,
            products,
            total_with_tip,
            
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);


        await Cart.deleteOne({ guestId: guest_id });      

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getOrder = async (req, res) => {
    // const user_id = req.user.userId;
    const order_id = req.params.order_id;

    try {
        const order = await OrderModel.findOne({ _id: order_id })
            .populate({
                path: 'products.product_ID',
                model: 'Products',
                select: 'name price description' // select fields you want from product
            })
            .populate({
                path: 'address_id',
                model: 'Address',
                select: 'guest_id house_no street city postcode instructions appartment_name floor building_name entry_code business_name hotel_name business' // select fields for Address
            });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// New function to get the list of all orders
const getOrdersList = async (req, res) => {
    try {
        const orders = await OrderModel.find()
            .populate({
                path: 'products.product_ID',
                model: 'Products',
                select: 'name price description'
            })
            .populate({
                path: 'address_id',
                model: 'Address',
                select: 'guest_id house_no street city postcode instructions appartment_name floor building_name entry_code business_name hotel_name business address_type'
            });
        if (!orders || orders.length === 0) {
            return res.status(404).json({ error: 'No orders found' });
        }

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

async function deleteOrder(req, res) {
    const { id } = req.params;

    try {
      const deletedCategory =   await OrderModel.findByIdAndDelete(id);

      if (!deletedCategory) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

module.exports = {
    createOrder,
    getOrder,
    getOrdersList,
    deleteOrder
};
