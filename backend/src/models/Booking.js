const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    // The user who booked the appointment
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // The medical professional
    medicalUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // The specific date and time for the appointment
    startTime: {
      type: Date,
      required: true,
    },
    // The end time
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    // Notes from the patient
    notes: {
      type: String,
      default: '',
    },
    // The meeting link, copied from the medical user's profile at booking time
    meetingLink: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Prevent double-booking for the same medical user at the same time
BookingSchema.index({ medicalUserId: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model('Booking', BookingSchema);