// const express = require('express');
// const stripe = require('stripe')('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'); 
// const router = express.Router();

// // Endpoint to create a payment intent
// router.post('/create-payment-intent', async (req, res) => {
//   try {
//     const { amount } = req.body;

//     // Ensure amount is valid
//     if (!amount || amount <= 0) {
//       return res.status(400).send({ error: 'Invalid amount' });
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount, // Amount in cents (e.g., $10 would be 1000)
//       currency: 'usd', // Choose your currency
//     });

//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     res.status(400).send({ error: error.message });
//   }
// });

// module.exports = router;

const express = require("express");
const Stripe = require("stripe");

const router = express.Router();
console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount:Math.round(amount * 100),
      currency: "gbp",
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;