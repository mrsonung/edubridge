const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Enable CORS and JSON parsing for incoming requests
app.use(cors());
app.use(express.json());

// Serve static files from the uploads folder (for profile pictures)
app.use('/uploads', express.static('uploads'));

// Routes for dashboard features like bookings/messages
app.use('/dashboard', dashboardRoutes);

// Routes for authentication, registration, profile update
app.use('/auth', authRoutes);

// Connect to MongoDB Atlas using the connection string in .env MONGO_URI
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
