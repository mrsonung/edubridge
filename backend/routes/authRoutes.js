const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// --- Multer setup for file uploads ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// --- Student Registration ---
router.post('/register/student', async (req, res) => {
  const { name, email, password, grade, subjects } = req.body;
  if (!name || !email || !password || !grade || !subjects) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = await Student.create({
      name,
      email,
      password: hashedPassword,
      grade,
      subjects: Array.isArray(subjects) ? subjects : subjects.split(',').map(s => s.trim())
    });
    res.json({ message: "Student registered!", student: newStudent });
  } catch (error) {
    console.error("Student registration error:", error);
    res.status(400).json({ error: "Student registration failed: " + error.message });
  }
});

// --- Teacher Registration ---
router.post('/register/teacher', async (req, res) => {
  const { name, email, password, grades, subjects, qualification } = req.body;
  if (!name || !email || !password || !grades || !subjects || !qualification) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newTeacher = await Teacher.create({
      name,
      email,
      password: hashedPassword,
      grades: Array.isArray(grades) ? grades : grades.split(',').map(g => g.trim()),
      subjects: Array.isArray(subjects) ? subjects : subjects.split(',').map(s => s.trim()),
      qualification,
      registrationPaid: false
    });
    res.json({ message: "Teacher registered! Please proceed to payment.", teacher: newTeacher });
  } catch (error) {
    console.error("Teacher registration error:", error);
    res.status(400).json({ error: "Teacher registration failed: " + error.message });
  }
});

// --- Login (Same for both) ---
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  let user;
  if (role === 'student') user = await Student.findOne({ email });
  else if (role === 'teacher') user = await Teacher.findOne({ email });
  else return res.status(400).json({ error: "Role is required." });

  if (!user) return res.status(400).json({ error: "User not found" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ message: "Login successful", token, user });
});

// --- Student Profile Edit WITH Profile Pic Upload ---
router.put('/update/student/:id', upload.single('profilePic'), async (req, res) => {
  try {
    const updateFields = { ...req.body };
    if (req.file) {
      updateFields.profilePic = `http://localhost:5000/uploads/${req.file.filename}`;
    }
    if (updateFields.subjects && typeof updateFields.subjects === "string") {
      updateFields.subjects = updateFields.subjects.split(',').map(s => s.trim());
    }
    const updated = await Student.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Teacher Profile Edit WITH Profile Pic Upload ---
router.put('/update/teacher/:id', upload.single('profilePic'), async (req, res) => {
  try {
    const updateFields = { ...req.body };
    if (req.file) {
      updateFields.profilePic = `http://localhost:5000/uploads/${req.file.filename}`;
    }
    if (updateFields.grades && typeof updateFields.grades === "string") {
      updateFields.grades = updateFields.grades.split(',').map(g => g.trim());
    }
    if (updateFields.subjects && typeof updateFields.subjects === "string") {
      updateFields.subjects = updateFields.subjects.split(',').map(s => s.trim());
    }
    const updated = await Teacher.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all teachers (for public listing)
router.get('/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Middleware to authenticate user and get user ID should be set up already

router.post('/student/favorites/add', async (req, res) => {
  const { teacherId } = req.body;
  const studentId = req.user.id; // from auth middleware token

  try {
    const student = await Student.findById(studentId);
    if (!student.favorites.includes(teacherId)) {
      student.favorites.push(teacherId);
      await student.save();
    }
    res.json({ favorites: student.favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
