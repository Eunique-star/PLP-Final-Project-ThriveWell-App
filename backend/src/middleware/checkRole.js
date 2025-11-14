const User = require('../models/User.js');
const asyncHandler = require('express-async-handler');

// This middleware factory checks if the authenticated user has one of the required roles.
// It MUST run *after* the `clerkAuth` middleware.
// Example usage: checkRole('admin') or checkRole('writer', 'admin')
const checkRole = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    // 1. Get the user's Clerk ID from the `clerkAuth` middleware
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    // 2. Find this user in our own MongoDB database
    const user = await User.findOne({ clerkId: userId }).select('role');

    if (!user) {
      return res.status(404).json({ message: 'User not found in our database.' });
    }

    // 3. Check if the user's role is in the list of allowed roles
    if (!roles.includes(user.role)) {
      return res.status(403).json({
        message: `Forbidden. You must have one of the following roles: ${roles.join(', ')}`,
      });
    }

    // 4. If all checks pass, proceed to the next handler
    next();
  });
};

module.exports = { checkRole };