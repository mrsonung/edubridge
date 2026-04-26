require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const paymentRoutes = require("./routes/paymentRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();


// =======================
// 🔥 CORS FIX (IMPORTANT FOR VERCEL)
// =======================
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-frontend.vercel.app" // 👈 replace after deploy
  ],
  credentials: true
}));


// =======================
// 🔥 BODY PARSER
// =======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =======================
// 🔥 STATIC FILES (IMAGES)
// =======================
app.use('/uploads', express.static('uploads'));


// =======================
// 🔥 ROUTES
// =======================
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/payment', paymentRoutes); // ✅ FIXED (better naming)
app.use('/booking', bookingRoutes);


// =======================
// 🔥 HEALTH CHECK ROUTE
// =======================
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});


// =======================
// 🔥 DB CONNECTION
// =======================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected!'))
.catch((err) => console.error('MongoDB connection error:', err));


// =======================
// 🔥 ERROR HANDLER (IMPORTANT)
// =======================
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ error: "Something went wrong" });
});


// =======================
// 🔥 SERVER START
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
});