const express = require('express');
const router = express.Router();
const chatService = require('../services/chatService');
const voiceService = require('../services/voiceService');

// Combined endpoint: Chat with AI and get voice response
router.post('/voice-chat', async (req, res, next) => {
  try {
    const { message, voiceId, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Step 1: Get AI response from Gemini
    const aiResponse = await chatService.getChatResponse(message, conversationHistory);

    // Step 2: Synthesize speech only if voiceId is provided
    const effectiveVoiceId = voiceId || process.env.ELEVENLABS_VOICE_ID;
    let audioBase64 = null;

    if (effectiveVoiceId) {
      try {
        const audioBuffer = await voiceService.synthesizeSpeech(aiResponse.text, {
          voiceId: effectiveVoiceId,
          stability: 0.5,
          similarityBoost: 0.75
        });
        audioBase64 = audioBuffer.toString('base64');
      } catch (voiceError) {
        // If voice synthesis fails, continue without audio
        console.warn('Voice synthesis failed, returning text only:', voiceError.message);
      }
    }

    res.json({
      success: true,
      text: aiResponse.text,
      ...(audioBase64 && { audio: audioBase64 }),
      conversationHistory: aiResponse.conversationHistory
    });
  } catch (error) {
    next(error);
  }
});

// Text-only chat endpoint (without voice synthesis)
router.post('/text-chat', async (req, res, next) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await chatService.getChatResponse(message, conversationHistory);

    res.json({
      success: true,
      text: response.text,
      conversationHistory: response.conversationHistory
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

