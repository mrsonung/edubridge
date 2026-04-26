// models/DeletedStudent.js

const mongoose = require('mongoose');

const DeletedStudentSchema = new mongoose.Schema({
  originalId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: String,
  email: String,
  password: String,
  grade: String,
  subjects: [String],
  profilePic: String,
  deletedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('DeletedStudent', DeletedStudentSchema);
