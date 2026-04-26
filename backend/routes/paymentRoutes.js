const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    // ✅ YAHI PE INIT KAR (correct place)
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json(order);

  } catch (err) {
    console.error("PAYMENT ERROR:", err);
    res.status(500).json({ error: "Payment failed" });
  }
});

module.exports = router;