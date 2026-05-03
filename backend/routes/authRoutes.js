const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const authenticate = require('../middleware/authenticate');

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();

// =======================
// CLOUDINARY
// =======================
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "edubridge",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});
const upload = multer({ storage });

// =======================
// STUDENT REGISTER
// =======================
router.post('/register/student', async (req, res) => {
  try {
    const { name, email, password, grade, subjects } = req.body;

    if (!name || !email || !password || !grade || !subjects) {
      return res.status(400).json({ error: "All fields required" });
    }

    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      grade,
      subjects: subjects.split(',').map(s => s.trim())
    });

    res.json({ message: "Student registered", student });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// TEACHER REGISTER
// =======================
router.post('/register/teacher', async (req, res) => {
  try {
    const { name, email, password, grades, subjects, qualification } = req.body;

    const existing = await Teacher.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await Teacher.create({
      name,
      email,
      password: hashedPassword,
      grades: grades.split(',').map(g => g.trim()),
      subjects: subjects.split(',').map(s => s.trim()),
      qualification,
      registrationPaid: false
    });

    res.json({ message: "Teacher registered", teacher });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// LOGIN
// =======================
router.post('/login', async (req, res) => {
  try {
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

    res.json({ token, user, role });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// GOOGLE AUTH (LOGIN + SIGNUP)
// =======================
router.post("/google-auth", async (req, res) => {
  try {
    const { credential, role } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    let user = await Student.findOne({ email });
    let userRole = "student";

    if (!user) {
      user = await Teacher.findOne({ email });
      if (user) userRole = "teacher";
    }

    // NEW USER
    if (!user) {
      if (!role) {
        return res.json({ newUser: true, email, name, picture });
      }

      if (role === "student") {
        user = await Student.create({
          name,
          email,
          password: "google_auth",
          grade: "",
          subjects: [],
          profilePic: picture
        });
      }

      if (role === "teacher") {
        user = await Teacher.create({
          name,
          email,
          password: "google_auth",
          grades: [],
          subjects: [],
          qualification: "",
          profilePic: picture,
          registrationPaid: false
        });
      }

      userRole = role;
    }

    const token = jwt.sign(
      { id: user._id, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user, role: userRole });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Google auth failed" });
  }
});

// =======================
// UPDATE STUDENT
// =======================
router.put("/update/student/:id", upload.single("profilePic"), async (req, res) => {
  try {
    const { name, grade, subjects } = req.body;

    let updatedData = {
      name,
      grade,
      subjects: subjects?.split(",").map(s => s.trim()) || []
    };

    if (req.file) {
      updatedData.profilePic = req.file.path;
    }

    const user = await Student.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// UPDATE TEACHER
// =======================
router.put('/update/teacher/:id', upload.single('profilePic'), async (req, res) => {
  try {
    let updateFields = { ...req.body };

    if (req.file) {
      updateFields.profilePic = req.file.path;
    }

    if (typeof updateFields.grades === "string") {
      updateFields.grades = updateFields.grades.split(',').map(g => g.trim());
    }

    if (typeof updateFields.subjects === "string") {
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
// GET TEACHERS
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
// GET SINGLE TEACHER
// =======================
router.get('/teacher/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Not found" });

    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// DELETE ACCOUNT
// =======================
router.delete('/delete-account', authenticate, async (req, res) => {
  try {
    if (req.role === 'student') {
      await Student.findByIdAndDelete(req.user._id);
    } else {
      await Teacher.findByIdAndDelete(req.user._id);
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;