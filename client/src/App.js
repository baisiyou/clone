import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import VoiceCloneUpload from './components/VoiceCloneUpload';
import ChatInterface from './components/ChatInterface';
import VoiceList from './components/VoiceList';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function App() {
  const [currentVoiceId, setCurrentVoiceId] = useState('');
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/voice/list`);
      setVoices(response.data.voices || []);
      // Set the first voice as default if available
      if (response.data.voices && response.data.voices.length > 0 && !currentVoiceId) {
        setCurrentVoiceId(response.data.voices[0].voice_id);
      }
    } catch (err) {
      console.error('Error loading voices:', err);
      setError('Failed to load voices');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceCloned = (voiceId) => {
    setCurrentVoiceId(voiceId);
    loadVoices(); // Refresh voice list
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎙️ Voice Clone Chat</h1>
        <p>Voice Cloning with ElevenLabs + AI Conversation with Google Gemini</p>
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

