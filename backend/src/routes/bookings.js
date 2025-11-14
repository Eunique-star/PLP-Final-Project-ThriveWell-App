const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookingsAsPatient,
  getMyScheduleAsMedical,
  cancelBooking,
  getBookingsForMedicalUser,
} = require('../controllers/bookingController.js');

const { clerkAuth } = require('../middleware/clerkAuth.js');
const { checkRole } = require('../middleware/checkRole.js');

// --- User Routes (Private, authenticated) ---
router.post('/', clerkAuth, createBooking);
router.get('/my-bookings', clerkAuth, getMyBookingsAsPatient);
router.put('/:id/cancel', clerkAuth, cancelBooking);

// --- Medical User Routes (Private, 'medical' role) ---
router.get(
  '/my-schedule',
  clerkAuth,
  checkRole('medical', 'admin'),
  getMyScheduleAsMedical
);

// --- Public Route ---
// Get all *confirmed* bookings for a medical user
// This is used by the frontend to block out times on the calendar
router.get('/medical/:clerkId', getBookingsForMedicalUser);

module.exports = router;