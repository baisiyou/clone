const { GoogleGenerativeAI } = require('@google/generative-ai');

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;

if (!GOOGLE_AI_API_KEY) {
  console.warn('Warning: GOOGLE_AI_API_KEY is not set');
}

let genAI = null;
if (GOOGLE_AI_API_KEY) {
  genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);
}

/**
 * Get chat response from Google Gemini
 * @param {string} message - User message
 * @param {Array} conversationHistory - Previous conversation history
 * @returns {Promise<Object>} Response with text and updated conversation history
 */
async function getChatResponse(message, conversationHistory = []) {
  try {
    if (!genAI) {
      throw new Error('Google AI API key is not configured');
    }

    // Use gemini-2.5-flash (latest stable model, faster and more cost-effective)
    // Alternative: gemini-2.5-pro for better quality (slower, more expensive)
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    // Build conversation context
    let prompt = '';
    if (conversationHistory.length > 0) {
      // Include recent conversation history (last 10 messages)
      const recentHistory = conversationHistory.slice(-10);
      prompt = recentHistory
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
      prompt += `\nUser: ${message}\nAssistant:`;
    } else {
      // First message - add system context
      prompt = `You are a helpful and empathetic AI assistant. Respond naturally and conversationally.\n\nUser: ${message}\nAssistant:`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Update conversation history
    const updatedHistory = [
      ...conversationHistory,
      { role: 'user', content: message },
      { role: 'assistant', content: text }
    ];

    return {
      text: text,
      conversationHistory: updatedHistory
    };
  } catch (error) {
    console.error('Error getting chat response:', error);
    throw new Error(`Failed to get chat response: ${error.message}`);
  }
}

/**
 * Get chat response using streaming (for real-time responses)
 * @param {string} message - User message
 * @param {Array} conversationHistory - Previous conversation history
 * @returns {AsyncGenerator<string>} Stream of response chunks
 */
async function* getChatResponseStream(message, conversationHistory = []) {
  try {
    if (!genAI) {
      throw new Error('Google AI API key is not configured');
    }

    // Use gemini-2.5-flash (latest stable model, faster and more cost-effective)
    // Alternative: gemini-2.5-pro for better quality (slower, more expensive)
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    // Build conversation context
    let prompt = '';
    if (conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10);
      prompt = recentHistory
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
      prompt += `\nUser: ${message}\nAssistant:`;
    } else {
      prompt = `You are a helpful and empathetic AI assistant. Respond naturally and conversationally.\n\nUser: ${message}\nAssistant:`;
    }

    const result = await model.generateContentStream(prompt);
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      yield chunkText;
    }
  } catch (error) {
    console.error('Error in chat stream:', error);
    throw error;
  }
}

module.exports = {
  getChatResponse,
  getChatResponseStream
};

