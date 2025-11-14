const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    // The user who is applying
    userClerkId: {
      type: String,
      required: true,
      index: true,
    },
    // The user's ID in our DB, will be populated
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roleAppliedFor: {
      type: String,
      required: [true, 'Please specify the role you are applying for'],
      enum: ['writer', 'medical'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    // --- Information for the application ---
    bio: {
      type: String,
      required: [true, 'Please provide a bio or statement'],
    },
    // Only required if applying for 'medical' role
    specialty: {
      type: String,
      default: '',
    },
    // We can add fields for document uploads (e.g., certifications) here later
    // e.g., qualifications: [{ name: String, fileUrl: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', ApplicationSchema);