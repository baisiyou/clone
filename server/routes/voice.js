const express = require('express');
const router = express.Router();
const multer = require('multer');
const voiceService = require('../services/voiceService');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-m4a', 'audio/webm'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  }
});

// Clone voice from audio file
router.post('/clone', upload.single('audio'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const { name, description } = req.body;
    const audioBuffer = req.file.buffer;

    const voiceId = await voiceService.cloneVoice(audioBuffer, {
      name: name || 'Cloned Voice',
      description: description || 'Cloned voice from uploaded audio'
    });

    res.json({
      success: true,
      voiceId: voiceId,
      message: 'Voice cloned successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get list of available voices
router.get('/list', async (req, res, next) => {
  try {
    const voices = await voiceService.listVoices();
    res.json({ success: true, voices });
  } catch (error) {
    next(error);
  }
});

// Synthesize speech from text using cloned voice
router.post('/synthesize', async (req, res, next) => {
  try {
    const { text, voiceId, stability, similarityBoost } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const audioBuffer = await voiceService.synthesizeSpeech(text, {
      voiceId: voiceId || process.env.ELEVENLABS_VOICE_ID,
      stability: stability || 0.5,
      similarityBoost: similarityBoost || 0.75
    });

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="speech.mp3"');
    res.send(audioBuffer);
  } catch (error) {
    next(error);
  }
});

// Delete a cloned voice
router.delete('/:voiceId', async (req, res, next) => {
  try {
    const { voiceId } = req.params;
    await voiceService.deleteVoice(voiceId);
    res.json({ success: true, message: 'Voice deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

