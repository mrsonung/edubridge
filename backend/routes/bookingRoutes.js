const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const mongoose = require("mongoose"); // ✅ ADD THIS

router.post("/create", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();

    res.status(201).json({ message: "Booking saved", booking });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save booking" });
  }
});

router.get("/teacher/:id", async (req, res) => {
  try {
    const bookings = await Booking.find({
      teacherId: new mongoose.Types.ObjectId(req.params.id)
    })
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (err) {
    console.log("ERROR:", err); // 
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

module.exports = router;