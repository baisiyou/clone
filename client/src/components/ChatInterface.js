import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatInterface.css';
import { API_BASE_URL } from '../config';

function ChatInterface({ voiceId, disabled }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading || disabled) return;

    const userMessage = inputText.trim();
    setInputText('');
    setLoading(true);

    // Add user message to UI
    const newUserMessage = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Use voice-chat endpoint only if voiceId is provided, otherwise use text-chat
      const endpoint = voiceId ? 'voice-chat' : 'text-chat';
      const response = await axios.post(`${API_BASE_URL}/chat/${endpoint}`, {
        message: userMessage,
        ...(voiceId && { voiceId: voiceId }),
        conversationHistory: conversationHistory
      });

      // Add assistant response to UI
      const assistantMessage = {
        role: 'assistant',
        content: response.data.text,
        audio: response.data.audio
      };
      setMessages(prev => [...prev, assistantMessage]);
      setConversationHistory(response.data.conversationHistory || []);

      // Play audio response only if available
      if (response.data.audio) {
        playAudio(response.data.audio);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, an error occurred: ${errorMessage}`,
        error: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (audioBase64) => {
    try {
      const audio = new Audio(`data:audio/mpeg;base64,${audioBase64}`);
      audio.play().catch(err => console.error('Audio play error:', err));
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Create audio blob for future speech-to-text implementation
        // eslint-disable-next-line no-unused-vars
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // Here you could convert speech to text using Web Speech API or a service
        // For now, we'll just show a message
        setInputText('(Voice recorded, please type your message manually)');
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Cannot access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>💬 AI Chat</h2>
        {disabled && (
          <p className="warning">Please clone a voice first to enable chat functionality</p>
        )}
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <p>Start a conversation! After you send a message, the AI will respond with the cloned voice.</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">
              {msg.content}
              {msg.audio && (
                <button
                  className="play-audio-btn"
                  onClick={() => playAudio(msg.audio)}
                  title="Play Audio"
                >
                  🔊 Play
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-content">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <textarea
            className="chat-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "Please clone a voice first..." : "Type your message..."}
            disabled={disabled || loading}
            rows={3}
          />
          <div className="chat-actions">
            <button
              className={`record-button ${isRecording ? 'recording' : ''}`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={disabled || loading}
              title={isRecording ? "Stop Recording" : "Voice Input"}
            >
              {isRecording ? '⏹️' : '🎤'}
            </button>
            <button
              className="send-button"
              onClick={handleSendMessage}
              disabled={!inputText.trim() || loading || disabled}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;

