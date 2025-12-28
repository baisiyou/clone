import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import VoiceCloneUpload from './components/VoiceCloneUpload';
import ChatInterface from './components/ChatInterface';
import VoiceList from './components/VoiceList';
import axios from 'axios';
import { API_BASE_URL } from './config';

// Log API URL in production for debugging
if (process.env.NODE_ENV === 'production') {
  console.log('API Base URL:', API_BASE_URL);
}

function App() {
  const [currentVoiceId, setCurrentVoiceId] = useState('');
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadVoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/voice/list`);
      setVoices(response.data.voices || []);
      // Set the first voice as default if available
      if (response.data.voices && response.data.voices.length > 0 && !currentVoiceId) {
        setCurrentVoiceId(response.data.voices[0].voice_id);
      }
    } catch (err) {
      console.error('Error loading voices:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to load voices';
      setError(`Failed to load voices: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [currentVoiceId]);

  useEffect(() => {
    loadVoices();
  }, [loadVoices]);

  const handleVoiceCloned = (voiceId) => {
    setCurrentVoiceId(voiceId);
    loadVoices(); // Refresh voice list
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎙️ Voice Clone Chat</h1>
      </header>

      <div className="App-container">
        <div className="App-sidebar">
          <VoiceCloneUpload 
            onVoiceCloned={handleVoiceCloned}
            loading={loading}
          />
          <VoiceList 
            voices={voices}
            currentVoiceId={currentVoiceId}
            onVoiceSelect={setCurrentVoiceId}
            onVoiceDeleted={loadVoices}
          />
        </div>

        <div className="App-main">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <ChatInterface 
            voiceId={currentVoiceId}
            disabled={!currentVoiceId}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

