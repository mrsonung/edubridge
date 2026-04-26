const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

module.exports = async function(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: 'No token provided.' });

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user;
    if (decoded.role === 'student') {
      user = await Student.findById(decoded.id);
    } else if (decoded.role === 'teacher') {
      user = await Teacher.findById(decoded.id);
    }
    if (!user) return res.status(401).json({ message: 'User not found.' });
    req.user = user;
    req.role = decoded.role;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};
