import React, { useState } from 'react';
import axios from 'axios';
import './VoiceCloneUpload.css';
import { API_BASE_URL } from '../config';

function VoiceCloneUpload({ onVoiceCloned, loading }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [voiceName, setVoiceName] = useState('');
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-m4a', 'audio/webm'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Unsupported audio format. Please upload MP3, WAV, or other common audio formats.');
        return;
      }
      // Validate file size (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size cannot exceed 10MB');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setSuccess(null);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an audio file first');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('name', voiceName || 'Cloned Voice');
      formData.append('description', 'Voice cloned from uploaded audio');

      const response = await axios.post(
        `${API_BASE_URL}/voice/clone`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setSuccess(`Voice cloned successfully! Voice ID: ${response.data.voiceId}`);
      setFile(null);
      setVoiceName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      if (onVoiceCloned) {
        onVoiceCloned(response.data.voiceId);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Upload failed. Please check your API key configuration');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="voice-clone-upload">
      <h2>🎤 Clone Voice</h2>
      <p className="upload-description">
        Upload a voice sample (recommended: 1-5 minutes of clear recording)
      </p>

      <div className="upload-form">
        <div className="form-group">
          <label>Voice Name (Optional)</label>
          <input
            type="text"
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value)}
            placeholder="e.g., Father's Voice"
            disabled={uploading}
          />
        </div>

        <div className="form-group">
          <label>Select Audio File</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="file-input-hidden"
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={handleFileButtonClick}
            disabled={uploading}
            className="file-select-button"
          >
            Choose File
          </button>
          {file && (
            <div className="file-info">
              <span>✓ {file.name}</span>
              <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          )}
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <button
          className="upload-button"
          onClick={handleUpload}
          disabled={!file || uploading || loading}
        >
          {uploading ? 'Uploading...' : 'Start Cloning'}
        </button>
      </div>
    </div>
  );
}

export default VoiceCloneUpload;

