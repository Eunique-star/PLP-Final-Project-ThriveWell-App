const Booking = require('../models/Booking.js');
const User = require('../models/User.js');
const asyncHandler = require('express-async-handler');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Authenticated Users)
const createBooking = asyncHandler(async (req, res) => {
  const { medicalClerkId, startTime, endTime, notes } = req.body;
  const { userId: patientClerkId } = req.auth;

  // 1. Find patient and medical user
  const patient = await User.findOne({ clerkId: patientClerkId });
  const medicalUser = await User.findOne({ clerkId: medicalClerkId });

  if (!patient || !medicalUser) {
    return res.status(404).json({ message: 'User not found' });
  }
  if (medicalUser.role !== 'medical') {
    return res.status(400).json({ message: 'This user is not a medical professional' });
  }
  if (patient.clerkId === medicalUser.clerkId) {
    return res.status(400).json({ message: 'You cannot book an appointment with yourself' });
  }

  // 2. Basic validation
  const start = new Date(startTime);
  if (start < new Date()) {
    return res.status(400).json({ message: 'Cannot book appointments in the past' });
  }

  // 3. Check for double-booking
  // We added a unique index to the model, but this provides a cleaner error message.
  const existingBooking = await Booking.findOne({
    medicalUserId: medicalUser._id,
    startTime: start,
    status: 'confirmed',
  });

  if (existingBooking) {
    return res.status(400).json({ message: 'This time slot is already booked' });
  }

  // 4. Create booking
  const booking = new Booking({
    patientId: patient._id,
    medicalUserId: medicalUser._id,
    startTime: start,
    endTime: new Date(endTime),
    notes,
    meetingLink: medicalUser.profile.meetingLink || '',
  });

  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
});

// @desc    Get all bookings for the logged-in patient
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookingsAsPatient = asyncHandler(async (req, res) => {
  const { userId: patientClerkId } = req.auth;
  const patient = await User.findOne({ clerkId: patientClerkId });

  const bookings = await Booking.find({ patientId: patient._id })
    .populate('medicalUserId', 'username profile') // Show medical user's info
    .sort({ startTime: 1 });
  res.json(bookings);
});

// @desc    Get all bookings for the logged-in medical user
// @route   GET /api/bookings/my-schedule
// @access  Private/Medical
const getMyScheduleAsMedical = asyncHandler(async (req, res) => {
  const { userId: medicalClerkId } = req.auth;
  const medicalUser = await User.findOne({ clerkId: medicalClerkId });

  const bookings = await Booking.find({ medicalUserId: medicalUser._id })
    .populate('patientId', 'username') // Show patient's name
    .sort({ startTime: 1 });
  res.json(bookings);
});

// @desc    Get all confirmed bookings for a specific medical user
// @route   GET /api/bookings/medical/:clerkId
// @access  Public
const getBookingsForMedicalUser = asyncHandler(async (req, res) => {
  const { clerkId } = req.params;
  const medicalUser = await User.findOne({ clerkId });
  if (!medicalUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  const bookings = await Booking.find({
    medicalUserId: medicalUser._id,
    status: 'confirmed',
    startTime: { $gte: new Date() }, // Only future bookings
  }).select('startTime endTime'); // Only send the times, not patient info

  res.json(bookings);
});

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
  const { userId: clerkId } = req.auth;
  const user = await User.findOne({ clerkId });
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Check if user is the patient OR the medical professional
  const isPatient = booking.patientId.toString() === user._id.toString();
  const isMedical = booking.medicalUserId.toString() === user._id.toString();

  if (!isPatient && !isMedical) {
    return res.status(403).json({ message: 'Not authorized to modify this booking' });
  }

  if (booking.status === 'cancelled') {
    return res.status(400).json({ message: 'Booking is already cancelled' });
  }

  booking.status = 'cancelled';
  const updatedBooking = await booking.save();
  res.json(updatedBooking);
});

module.exports = {
  createBooking,
  getMyBookingsAsPatient,
  getMyScheduleAsMedical,
  cancelBooking,
  getBookingsForMedicalUser,
};