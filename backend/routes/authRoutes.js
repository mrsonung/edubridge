const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const authenticate = require('../middleware/authenticate');

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

// ✅ CLOUDINARY STORAGE
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "edubridge",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

// =======================
// 👨‍🎓 STUDENT REGISTER
// =======================
router.post('/register/student', async (req, res) => {
  const { name, email, password, grade, subjects } = req.body;

  if (!name || !email || !password || !grade || !subjects) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      grade,
      subjects: Array.isArray(subjects)
        ? subjects
        : subjects.split(',').map(s => s.trim())
    });

    res.json({ message: "Student registered", student });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// =======================
// 👨‍🏫 TEACHER REGISTER
// =======================
router.post('/register/teacher', async (req, res) => {
  const { name, email, password, grades, subjects, qualification } = req.body;

  if (!name || !email || !password || !grades || !subjects || !qualification) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await Teacher.create({
      name,
      email,
      password: hashedPassword,
      grades: Array.isArray(grades)
        ? grades
        : grades.split(',').map(g => g.trim()),
      subjects: Array.isArray(subjects)
        ? subjects
        : subjects.split(',').map(s => s.trim()),
      qualification,
      registrationPaid: false
    });

    res.json({ message: "Teacher registered", teacher });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// =======================
// 🔐 LOGIN
// =======================
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  let user;

  if (role === 'student') user = await Student.findOne({ email });
  else if (role === 'teacher') user = await Teacher.findOne({ email });
  else return res.status(400).json({ error: "Role required" });

  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign(
    { id: user._id, role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, user });
});

// =======================
// 👨‍🎓 UPDATE STUDENT
// =======================
router.put('/update/student/:id', upload.single('profilePic'), async (req, res) => {
  try {
    const updateFields = { ...req.body };

    if (req.file) {
      updateFields.profilePic = req.file.path; // ✅ Cloudinary URL
    }

    if (updateFields.subjects && typeof updateFields.subjects === "string") {
      updateFields.subjects = updateFields.subjects.split(',').map(s => s.trim());
    }

    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// 👨‍🏫 UPDATE TEACHER
// =======================
router.put('/update/teacher/:id', upload.single('profilePic'), async (req, res) => {
  try {
    const updateFields = { ...req.body };

    if (req.file) {
      updateFields.profilePic = req.file.path; // ✅ Cloudinary URL
    }

    if (updateFields.grades && typeof updateFields.grades === "string") {
      updateFields.grades = updateFields.grades.split(',').map(g => g.trim());
    }

    if (updateFields.subjects && typeof updateFields.subjects === "string") {
      updateFields.subjects = updateFields.subjects.split(',').map(s => s.trim());
    }

    const updated = await Teacher.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// 📋 GET ALL TEACHERS
// =======================
router.get('/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// 🔍 GET SINGLE TEACHER
// =======================
router.get('/teacher/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.json(teacher);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// 🗑 DELETE ACCOUNT
// =======================
router.delete('/delete-account', authenticate, async (req, res) => {
  try {
    if (req.role === 'student') {
      await Student.findByIdAndDelete(req.user._id);
    } else if (req.role === 'teacher') {
      await Teacher.findByIdAndDelete(req.user._id);
    }

    res.json({ message: "Account deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;