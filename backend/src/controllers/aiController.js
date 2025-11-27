const { GoogleGenerativeAI } = require('@google/generative-ai');
const asyncHandler = require('express-async-handler');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro-latest' });

// System instruction
const SYSTEM_INSTRUCTION = `You are a helpful health information assistant for ThriveWell. Provide accurate health information about nutrition, mental health, fitness, and wellness. Always remind users to consult healthcare professionals for medical advice. Be empathetic and supportive.`;

// @desc    Chat with AI assistant
// @route   POST /api/ai/chat
// @access  Public
const chatWithAI = asyncHandler(async (req, res) => {
  const { message, conversationHistory = [] } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    // Build conversation context
    let prompt = SYSTEM_INSTRUCTION + '\n\n';
    
    // Add conversation history
    conversationHistory.forEach(msg => {
      prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
    });
    
    // Add current message
    prompt += `User: ${message}\nAssistant:`;

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    res.json({
      response: aiResponse,
      conversationHistory: [
        ...conversationHistory,
        { role: 'user', content: message },
        { role: 'assistant', content: aiResponse }
      ]
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      message: 'Failed to get AI response. Please try again.',
      error: error.message 
    });
  }
});

module.exports = { chatWithAI };