const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/aiController.js');

// POST /api/ai/chat
// Send a message to AI assistant
router.post('/chat', chatWithAI);

module.exports = router;