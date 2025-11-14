const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema(
  {
    // Link to the medical professional
    medicalUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // 0 = Sunday, 1 = Monday, 2 = Tuesday, ..., 6 = Saturday
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },
    // Start time in 24-hour format, e.g., "09:00"
    startTime: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:mm format'],
    },
    // End time in 24-hour format, e.g., "17:00"
    endTime: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:mm format'],
    },
  },
  { timestamps: true }
);

// Prevent duplicate entries for the same user, day, and time
AvailabilitySchema.index({ medicalUserId: 1, dayOfWeek: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model('Availability', AvailabilitySchema);