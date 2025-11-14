const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// This is the real, production-ready middleware
const realClerkAuth = ClerkExpressRequireAuth();

const clerkAuth = (req, res, next) => {
  // Check if we are in a production environment
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Look for a special header, e.g., 'x-test-clerk-id'
  const testClerkId = req.headers['x-test-clerk-id'];

  // --- LOCAL TEST BYPASS ---
  // If we are NOT in production AND that header is present...
  if (!isProduction && testClerkId) {
    // We are testing! Let's bypass Clerk and create a fake auth object.
    // This fake object is all that our `checkRole` middleware needs to work.
    req.auth = {
      userId: testClerkId, // This is the Clerk ID
      sessionId: 'fake-session-id-for-testing',
    };
    
    // Skip real auth and go to the next middleware (e.g., checkRole)
    return next(); 
  }

  // --- PRODUCTION/REAL AUTH ---
  // If we are in production, or no test header was sent,
  // use the real, secure Clerk authentication.
  return realClerkAuth(req, res, next);
};

module.exports = { clerkAuth };