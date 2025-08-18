const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  grades: [String],
  subjects: [String],
  qualification: String,
  registrationPaid: { type: Boolean, default: false },
  profilePic: { type: String, default: '/default_profile.png' }

});

module.exports = mongoose.model('Teacher', TeacherSchema);
