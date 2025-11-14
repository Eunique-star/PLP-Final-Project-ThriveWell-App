const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getMyApplicationStatus,
  getPendingApplications,
  approveApplication,
  rejectApplication,
} = require('../controllers/applicationController.js');

const { clerkAuth } = require('../middleware/clerkAuth.js');
const { checkRole } = require('../middleware/checkRole.js');

// --- User Routes (must be authenticated) ---

// POST /api/applications
// Submit a new application
router.post('/', clerkAuth, submitApplication);

// GET /api/applications/my-status
// Check the status of your own application
router.get('/my-status', clerkAuth, getMyApplicationStatus);

// --- Admin Routes (must be authenticated and 'admin') ---

// GET /api/applications
// Get all pending applications for review
router.get('/', clerkAuth, checkRole('admin'), getPendingApplications);

// PUT /api/applications/:id/approve
// Approve an application
router.put('/:id/approve', clerkAuth, checkRole('admin'), approveApplication);

// PUT /api/applications/:id/reject
// Reject an application
router.put('/:id/reject', clerkAuth, checkRole('admin'), rejectApplication);

module.exports = router;