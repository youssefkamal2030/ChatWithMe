import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') ?? 'Stranger';
  const isLoggedIn = localStorage.getItem('token');

  const handleCreateRoom = () => {
    isLoggedIn ? navigate('/CreatRoom') : navigate('/Login');
  };

  const handleJoinRoom = () => {
    isLoggedIn ? navigate("/Rooms") : navigate("/Login");
  };

  return (
    <div className="landing-page">
      {/* Animated Chat Bubbles Background */}
      <div className="chat-bubbles">
        <div className="bubble bubble-1">💬</div>
        <div className="bubble bubble-2">👋</div>
        <div className="bubble bubble-3">🚀</div>
        <div className="bubble bubble-4">❤️</div>
      </div>

      <div className="hero-content">
        <h1>
          Welcome, <span className="gradient-text">{username}</span>!
          <span className="waving-hand">👋</span>
        </h1>
        <p className="subtitle">Ready to connect with the world?</p>
        
        <div className="cta-buttons">
          <button className="cta-btn create-btn" onClick={handleCreateRoom}>
            Create New Room
            <span className="icon">➕</span>
          </button>
          <div className="separator">
            <span className="line"></span>
            <span className="text">or</span>
            <span className="line"></span>
          </div>
          <button className="cta-btn join-btn" onClick={handleJoinRoom}>
            Join Existing Room
            <span className="icon">🚪</span>
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Chats</h3>
            <p>End-to-end encrypted conversations</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Global Reach</h3>
            <p>Connect with people worldwide</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-time</h3>
            <p>Instant message delivery</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;