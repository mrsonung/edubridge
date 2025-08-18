const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  grade: String,
  subjects: [String],
  profilePic: { type: String, default: '' }   // Add this line
});

module.exports = mongoose.model('Student', StudentSchema);
