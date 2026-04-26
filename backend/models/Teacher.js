const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  grades: [String],
  subjects: [String],
  qualification: String,
  registrationPaid: { type: Boolean, default: false },
  
  // New fields:
  experience: { type: Number, default: 0 },      // years of experience
  numStudents: { type: Number, default: 0 },     // number of students taught
  location: { type: String, default: '' },
  bio: { type: String, default: '' },

  profilePic: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
