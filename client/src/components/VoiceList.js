import React, { useState } from 'react';
import axios from 'axios';
import './VoiceList.css';
import { API_BASE_URL } from '../config';

function VoiceList({ voices, currentVoiceId, onVoiceSelect, onVoiceDeleted }) {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (voiceId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this voice?')) {
      return;
    }

    setDeleting(voiceId);
    try {
      await axios.delete(`${API_BASE_URL}/voice/${voiceId}`);
      if (onVoiceDeleted) {
        onVoiceDeleted();
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setDeleting(null);
    }
  };

  if (!voices || voices.length === 0) {
    return (
      <div className="voice-list">
        <h2>🎵 Available Voices</h2>
        <p className="empty-message">No voices available. Please clone a voice first.</p>
      </div>
    );
  }

  return (
    <div className="voice-list">
      <h2>🎵 Available Voices</h2>
      <div className="voice-items">
        {voices.map((voice) => (
          <div
            key={voice.voice_id}
            className={`voice-item ${voice.voice_id === currentVoiceId ? 'active' : ''}`}
            onClick={() => onVoiceSelect(voice.voice_id)}
          >
            <div className="voice-info">
              <div className="voice-name">
                {voice.name}
                {voice.voice_id === currentVoiceId && (
                  <span className="active-badge">Active</span>
                )}
              </div>
              {voice.description && (
                <div className="voice-description">{voice.description}</div>
              )}
            </div>
            <button
              className="delete-button"
              onClick={(e) => handleDelete(voice.voice_id, e)}
              disabled={deleting === voice.voice_id}
              title="Delete Voice"
            >
              {deleting === voice.voice_id ? 'Deleting...' : '🗑️'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VoiceList;

