const Application = require('../models/Application.js');
const User = require('../models/User.js');
const asyncHandler = require('express-async-handler');

// @desc    Submit a new application
// @route   POST /api/applications
// @access  Private (Authenticated Users)
const submitApplication = asyncHandler(async (req, res) => {
  const { roleAppliedFor, bio, specialty } = req.body;
  const { userId: clerkId } = req.auth; // Renaming for clarity

  // 1. Find the user in our DB
  const user = await User.findOne({ clerkId });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // 2. Check if user is already an advanced user
  if (user.role !== 'user') {
    return res
      .status(400)
      .json({ message: 'You already have an advanced role.' });
  }

  // 3. Check for an existing pending application
  const existingApplication = await Application.findOne({
    userClerkId: clerkId,
    status: 'pending',
  });
  if (existingApplication) {
    return res
      .status(400)
      .json({ message: 'You already have a pending application.' });
  }

  // 4. Create and save the new application
  const application = new Application({
    userClerkId: clerkId,
    userId: user._id, // Link to our User model _id
    roleAppliedFor,
    bio,
    specialty: roleAppliedFor === 'medical' ? specialty : undefined,
  });

  const createdApplication = await application.save();
  res.status(201).json(createdApplication);
});

// @desc    Get the status of the user's application
// @route   GET /api/applications/my-status
// @access  Private (Authenticated Users)
const getMyApplicationStatus = asyncHandler(async (req, res) => {
  const { userId: clerkId } = req.auth;
  const application = await Application.findOne({ userClerkId: clerkId }).sort({
    createdAt: -1, // Get the most recent one
  });

  if (application) {
    res.json(application);
  } else {
    res.status(404).json({ message: 'No application found' });
  }
});

// @desc    Get all pending applications
// @route   GET /api/applications
// @access  Private (Admin)
const getPendingApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ status: 'pending' })
    .populate('userId', 'username email') // Show user's name and email
    .sort({ createdAt: 1 }); // Oldest first, for review order
  res.json(applications);
});

// @desc    Approve an application
// @route   PUT /api/applications/:id/approve
// @access  Private (Admin)
const approveApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  if (application.status !== 'pending') {
    return res
      .status(400)
      .json({ message: `Application is already ${application.status}` });
  }

  // 1. Update the User's role and profile
  const user = await User.findById(application.userId);
  if (!user) {
    // User might have been deleted, clean up application
    application.status = 'rejected';
    await application.save();
    return res.status(404).json({ message: 'User not found' });
  }

  user.role = application.roleAppliedFor;
  user.profile.bio = application.bio;
  if (application.roleAppliedFor === 'medical' && application.specialty) {
    user.profile.specialty = application.specialty;
  }
  await user.save();

  // 2. Update the Application status
  application.status = 'approved';
  await application.save();

  res.json({ message: 'Application approved and user role updated.' });
});

// @desc    Reject an application
// @route   PUT /api/applications/:id/reject
// @access  Private (Admin)
const rejectApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  if (application.status !== 'pending') {
    return res
      .status(400)
      .json({ message: `Application is already ${application.status}` });
  }

  application.status = 'rejected';
  await application.save();

  res.json({ message: 'Application rejected.' });
});

module.exports = {
  submitApplication,
  getMyApplicationStatus,
  getPendingApplications,
  approveApplication,
  rejectApplication,
};