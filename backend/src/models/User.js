const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: [true, 'Clerk ID is required'],
      unique: true,
      index: true, // Add an index for faster queries by clerkId
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    username: {
      type: String,
      // Username might not be set immediately on signup
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'writer', 'medical', 'admin'],
      default: 'user',
    },
    profile: {
      bio: { type: String, default: '' },
      specialty: { type: String, default: '' }, // e.g., "Doctor", "Nutritionist"
      profilePictureUrl: { type: String, default: '' },
      // NEW: Add a personal meeting link for 'medical' users
      meetingLink: { type: String, default: '' },
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;