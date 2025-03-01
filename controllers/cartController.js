const Cart = require("../models/cart");
require('dotenv').config();
const { validationResult } = require("express-validator");
var mongoose = require('mongoose');
const Product = require("../models/products");
const { v4: uuidv4 } = require('uuid');

async function addProductToCart(req, res) {
    try {
        const { guestId, product_id, quantity, gift, size, extras } = req.body;

        // Find the product by product_id
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }

        // Determine price based on size
        let basePrice = 0;

        if (size === 'small') {
            basePrice = product.small_price;
        } else if (size === 'medium') {
            basePrice = product.medium_price;
        } else if (size === 'large') {
            basePrice = product.large_price;
        } else {
            basePrice = product.price && product.price !== 0 ? product.price : 0;
        }


        if (basePrice === 0) {
            return res.status(400).json({ success: false,message: "Please Select a Size" });

        }

        // Calculate total price based on quantity
        let totalPrice = basePrice * quantity;

        // Add extras prices
        if (extras && Array.isArray(extras)) {
            const extrasTotal = extras.reduce((acc, extra) => acc + (extra.price || 0), 0);
            totalPrice += extrasTotal;
        }

        // Convert totalPrice to float
        totalPrice = parseFloat(totalPrice.toFixed(2)); // Ensure 2 decimal precision

        // Check if cart exists for the guestId
        let cart = await Cart.findOne({ guestId });

        if (!cart) {
            // Create new cart if not exists
            cart = new Cart({
                guestId,
                products: [{
                    product_ID: product_id,
                    quantity,
                    gift: gift || "",
                    size: size || "",
                    extras: extras || [],
                    total: totalPrice // Store as a float
                }],
                sub_total: totalPrice // Initialize sub_total for new cart
            });
        } else {
            // Check if product already exists in cart
            const existingProductIndex = cart.products.findIndex(p => p.product_ID.toString() === product_id);

            if (existingProductIndex !== -1) {
                // Recalculate total price based on updated quantity
                const existingProduct = cart.products[existingProductIndex];

                // Recalculate base price for the product based on size
                let basePrice = 0;
                if (size === 'small') basePrice = product.small_price;
                else if (size === 'medium') basePrice = product.medium_price;
                else if (size === 'large') basePrice = product.large_price;
                else basePrice = product.price;

                // Calculate total price for the updated quantity
                let updatedTotalPrice = basePrice * (existingProduct.quantity + quantity);

                // Add extras prices
                if (extras && Array.isArray(extras)) {
                    const extrasTotal = extras.reduce((acc, extra) => acc + (extra.price || 0), 0);
                    updatedTotalPrice += extrasTotal;
                }

                updatedTotalPrice = parseFloat(updatedTotalPrice.toFixed(2)); // Ensure 2 decimal precision

                // Update product details
                cart.products[existingProductIndex].quantity += quantity;
                cart.products[existingProductIndex].extras = [...cart.products[existingProductIndex].extras, ...extras];
                cart.products[existingProductIndex].total = updatedTotalPrice; // Update total price
            } else {
                // Add new product
                cart.products.push({
                    product_ID: product_id,
                    quantity,
                    gift: gift || "",
                    size: size || "",
                    extras: extras || [],
                    total: totalPrice // Store as a float
                });
            }

        }

        // Calculate the new sub_total as the sum of all product totals
        cart.sub_total = cart.products.reduce((acc, product) => acc + product.total, 0);
        cart.sub_total = parseFloat(cart.sub_total.toFixed(2)); // Ensure sub_total is a float with 2 decimal precision

        // Save updated cart
        await cart.save();

        return res.status(200).json({ success: true, data: cart });
    } catch (err) {
        console.error("Error:", err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
}


async function getCart(req, res) {
    try {
        const { guestId } = req.params;

        const cart = await Cart.findOne({ guestId }).populate({
            path: 'products.product_ID',
            model: 'Products',
            select: 'name shortDescription category subCategory  price small_price medium_price large_price gifts extra'
        });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found for the specified guestId' });
        }

        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}



async function removeFromCart(req, res) {
    const { product_id } = req.params;

    try {
        // Verify that the product exists
        const product = await ProductModel.findById(product_id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Find the cart (assuming no user ID for now)
        let cart = await cartModel.findOne();
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Find the product in the cart
        const productIndex = cart.products.findIndex(item => item.product_ID.toString() === product_id);

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        // Remove the product from the cart
        cart.products.splice(productIndex, 1);

        // Save the updated cart
        const updatedCart = await cart.save();

        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    addProductToCart,
    getCart,
    removeFromCart,
};
