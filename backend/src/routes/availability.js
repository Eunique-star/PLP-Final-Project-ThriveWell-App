const express = require('express');
const router = express.Router();
const {
  createAvailability,
  getMyAvailability,
  getAvailabilityForMedicalUser,
  deleteAvailability,
} = require('../controllers/availabilityController.js');

const { clerkAuth } = require('../middleware/clerkAuth.js');
const { checkRole } = require('../middleware/checkRole.js');

// --- Medical User Routes (Private, 'medical' role) ---
router.post(
  '/',
  clerkAuth,
  checkRole('medical', 'admin'),
  createAvailability
);
router.get(
  '/my-availability',
  clerkAuth,
  checkRole('medical', 'admin'),
  getMyAvailability
);
router.delete(
  '/:id',
  clerkAuth,
  checkRole('medical', 'admin'),
  deleteAvailability
);

// --- Public Route ---
// Get the availability for a specific medical professional by their clerkId
router.get('/medical/:clerkId', getAvailabilityForMedicalUser);

module.exports = router;