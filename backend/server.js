require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// ✅ CORS (SUPER FIX)
app.use(cors({
  origin: ["https://edubridge-ruby.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ HANDLE PREFLIGHT (IMPORTANT)
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/payment", paymentRoutes);
app.use("/booking", bookingRoutes);

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.error(err));

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running 🚀");
});