
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// ✅ CORS (simple + working)
app.use(cors({
  origin: true,
  credentials: true
}));

// ✅ FIXED preflight
app.options(/.*/, cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/payment", paymentRoutes);
app.use("/booking", bookingRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.error(err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});