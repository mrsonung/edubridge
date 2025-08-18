const express = require('express');
const Razorpay = require('razorpay');
const Teacher = require('../models/Teacher');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create Payment Order
router.post('/create-order', async (req, res) => {
  const { teacherId, grade } = req.body;
  let amount = (["1", "2", "3", "4", "5"].includes(grade)) ? 500 : 1000;

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`
  };

  try {
    const order = await razorpay.orders.create(options);
    // Update teacher registrationPaid as per payment flow after confirmation (to be handled in frontend webhook/pay success)
    res.json(order);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
