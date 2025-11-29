const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const asyncHandler = require('express-async-handler');

// @desc    Get all medical professionals
// @route   GET /api/users/medical-professionals
// @access  Public
const getMedicalProfessionals = asyncHandler(async (req, res) => {
  try {
    // Find all users with 'medical' role
    const professionals = await User.find({ role: 'medical' })
      .select('clerkId name email profile createdAt') // Only select needed fields
      .sort({ createdAt: -1 }); // Newest first

    res.json(professionals);
  } catch (error) {
    console.error('Error fetching medical professionals:', error);
    res.status(500).json({ message: 'Failed to fetch professionals' });
  }
});

router.get('/medical-professionals', getMedicalProfessionals);

module.exports = router;