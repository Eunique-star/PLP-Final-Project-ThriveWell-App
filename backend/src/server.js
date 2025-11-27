const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

// DEBUG: Check if env vars are loaded
console.log('📋 Environment Check:');
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   MongoDB:', process.env.MONGODB_URI ? '✅' : '❌');
console.log('   Gemini Key:', process.env.GEMINI_API_KEY ? '✅' : '❌');

const app = express();

connectDB();

// --- Import routes ---
//
// FIXED: The paths no longer include './src/' because server.js
// is already in the 'src' directory.
//
const webhookRoutes = require('./routes/webhooks.js');
const categoryRoutes = require('./routes/categories.js');
const articleRoutes = require('./routes/articles.js');
const applicationRoutes = require('./routes/applications.js');
const availabilityRoutes = require('./routes/availability.js');
const bookingRoutes = require('./routes/bookings.js');
const aiRoutes = require('./routes/ai.js');

// CRITICAL: Clerk webhooks need a raw body.
// This middleware must come BEFORE express.json()
app.use(
  '/api/webhooks/clerk',
  express.raw({ type: 'application/json' })
);

// Now we can use express.json() for all other routes
app.use(express.json());

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

// Define a simple root route
app.get('/', (req, res) => {
  res.send('ThriveWell API is running...');
});

// --- Use Routes ---
app.use('/api/webhooks', webhookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API is on http://localhost:${PORT}`));