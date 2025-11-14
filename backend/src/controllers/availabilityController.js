const asyncHandler = require('express-async-handler');
const User = require('../models/User.js');
const Availability = require('../models/Availability.js');

// @desc    Create a new availability
// @route   POST /api/availability
// @access  Private/Medical
const createAvailability = asyncHandler(async (req, res) => {
  const { dayOfWeek, startTime, endTime } = req.body;
  const { userId: clerkId } = req.auth;

  // 1. Find the medical user in our DB
  const medicalUser = await User.findOne({ clerkId });
  if (!medicalUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  // 2. Validate role
  if (medicalUser.role !== 'medical' && medicalUser.role !== 'admin') {
    return res.status(403).json({ message: 'User is not a medical professional' });
  }

  // 3. Check for existing availability at the same time
  const existingSlot = await Availability.findOne({
    medicalUserId: medicalUser._id,
    dayOfWeek,
    startTime,
  });

  if (existingSlot) {
    return res.status(400).json({ message: 'This availability slot already exists' });
  }

  // 4. Create new availability
  const availability = new Availability({
    medicalUserId: medicalUser._id,
    dayOfWeek,
    startTime,
    endTime,
  });

  const createdAvailability = await availability.save();
  res.status(201).json(createdAvailability);
});

// @desc    Get all availability for the logged-in medical user
// @route   GET /api/availability/my-availability
// @access  Private/Medical
const getMyAvailability = asyncHandler(async (req, res) => {
  const { userId: clerkId } = req.auth;
  const medicalUser = await User.findOne({ clerkId });

  const availability = await Availability.find({ medicalUserId: medicalUser._id }).sort({
    dayOfWeek: 1,
    startTime: 1,
  });
  
  res.json(availability);
});

// @desc    Get all availability for a specific medical user (by clerkId)
// @route   GET /api/availability/medical/:clerkId
// @access  Public
const getAvailabilityForMedicalUser = asyncHandler(async (req, res) => {
  const { clerkId } = req.params;
  const medicalUser = await User.findOne({ clerkId });

  if (!medicalUser) {
    return res.status(404).json({ message: 'Medical user not found' });
  }

  const availability = await Availability.find({ medicalUserId: medicalUser._id }).sort({
    dayOfWeek: 1,
    startTime: 1,
  });

  res.json(availability);
});

// @desc    Delete an availability
// @route   DELETE /api/availability/:id
// @access  Private/Medical
const deleteAvailability = asyncHandler(async (req, res) => {
  const { userId: clerkId } = req.auth;
  const availabilitySlot = await Availability.findById(req.params.id);

  if (!availabilitySlot) {
    return res.status(404).json({ message: 'Availability slot not found' });
  }

  // Find user to verify ownership
  const medicalUser = await User.findOne({ clerkId });
  if (availabilitySlot.medicalUserId.toString() !== medicalUser._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this slot' });
  }

  await availabilitySlot.deleteOne();
  res.json({ message: 'Availability slot removed' });
});


// Export all the controller functions
module.exports = {
  createAvailability,
  getMyAvailability,
  getAvailabilityForMedicalUser,
  deleteAvailability,
};