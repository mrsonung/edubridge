const express = require('express');
const Booking = require('../models/Booking');
const Message = require('../models/Message');
const router = express.Router();

router.get('/bookings', async (req, res) => {
  const { role, id } = req.query;
  let bookings;
  try {
    if (role === 'student') {
      bookings = await Booking.find({ studentId: id }).populate('teacherId', 'name');
    } else if (role === 'teacher') {
      bookings = await Booking.find({ teacherId: id }).populate('studentId', 'name');
    }
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/messages', async (req, res) => {
  const { id } = req.query;
  try {
    const messages = await Message.find({ $or: [{ from: id }, { to: id }] });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
