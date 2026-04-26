const authenticate = require('../middleware/authenticate');

// Permanent delete account (for student or teacher)
router.delete('/delete-account', authenticate, async (req, res) => {
  try {
    let deletedUser;
    if (req.role === 'student') {
      deletedUser = await Student.findByIdAndDelete(req.user._id);
    } else if (req.role === 'teacher') {
      deletedUser = await Teacher.findByIdAndDelete(req.user._id);
    } else {
      return res.status(400).json({ message: 'Unknown user role.' });
    }
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: 'Account deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Could not delete account.' });
  }
});
