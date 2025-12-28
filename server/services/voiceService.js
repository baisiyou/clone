const axios = require('axios');
const FormData = require('form-data');

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';

if (!ELEVENLABS_API_KEY) {
  console.warn('Warning: ELEVENLABS_API_KEY is not set');
}

const getHeaders = () => ({
  'xi-api-key': ELEVENLABS_API_KEY,
  'Content-Type': 'application/json'
});

/**
 * Clone a voice from audio sample
 * @param {Buffer} audioBuffer - Audio file buffer
 * @param {Object} options - Voice cloning options
 * @returns {Promise<string>} Voice ID
 */
async function cloneVoice(audioBuffer, options = {}) {
  try {
    const formData = new FormData();
    formData.append('name', options.name || 'Cloned Voice');
    formData.append('description', options.description || '');
    formData.append('files', audioBuffer, {
      filename: 'voice_sample.mp3',
      contentType: 'audio/mpeg'
    });

    const response = await axios.post(
      `${ELEVENLABS_BASE_URL}/voices/add`,
      formData,
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          ...formData.getHeaders()
        }
      }
    );

    return response.data.voice_id;
  } catch (error) {
    console.error('Error cloning voice:', error.response?.data || error.message);
    throw new Error(`Failed to clone voice: ${error.response?.data?.detail?.message || error.message}`);
  }
}

/**
 * List all available voices
 * @returns {Promise<Array>} List of voices
 */
async function listVoices() {
  try {
    const response = await axios.get(
      `${ELEVENLABS_BASE_URL}/voices`,
      { headers: getHeaders() }
    );
    return response.data.voices;
  } catch (error) {
    console.error('Error listing voices:', error.response?.data || error.message);
    throw new Error(`Failed to list voices: ${error.response?.data?.detail?.message || error.message}`);
  }
}

/**
 * Synthesize speech from text
 * @param {string} text - Text to synthesize
 * @param {Object} options - Synthesis options
 * @returns {Promise<Buffer>} Audio buffer
 */
async function synthesizeSpeech(text, options = {}) {
  try {
    const voiceId = options.voiceId || process.env.ELEVENLABS_VOICE_ID;
    
    if (!voiceId) {
      throw new Error('Voice ID is required. Set ELEVENLABS_VOICE_ID or provide voiceId in options.');
    }

    const response = await axios.post(
      `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`,
      {
        text: text,
        model_id: options.modelId || 'eleven_multilingual_v2',
        voice_settings: {
          stability: options.stability || 0.5,
          similarity_boost: options.similarityBoost || 0.75,
          style: options.style || 0.0,
          use_speaker_boost: options.useSpeakerBoost !== false
        }
      },
      {
        headers: getHeaders(),
        responseType: 'arraybuffer'
      }
    );

    return Buffer.from(response.data);
  } catch (error) {
    console.error('Error synthesizing speech:', error.response?.data || error.message);
    const errorDetail = error.response?.data?.detail;
    let errorMessage = 'Failed to synthesize speech';
    
    if (error.response?.status === 401) {
      errorMessage = 'Authentication failed. Please check your ElevenLabs API key in Render environment variables.';
    } else if (errorDetail?.message) {
      errorMessage = `Failed to synthesize speech: ${errorDetail.message}`;
    } else if (error.message) {
      errorMessage = `Failed to synthesize speech: ${error.message}`;
    }
    
    throw new Error(errorMessage);
  }
}

/**
 * Delete a voice
 * @param {string} voiceId - Voice ID to delete
 */
async function deleteVoice(voiceId) {
  try {
    await axios.delete(
      `${ELEVENLABS_BASE_URL}/voices/${voiceId}`,
      { headers: getHeaders() }
    );
  } catch (error) {
    console.error('Error deleting voice:', error.response?.data || error.message);
    throw new Error(`Failed to delete voice: ${error.response?.data?.detail?.message || error.message}`);
  }
}

module.exports = {
  cloneVoice,
  listVoices,
  synthesizeSpeech,
  deleteVoice
};

