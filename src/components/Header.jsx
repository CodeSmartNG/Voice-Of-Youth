import React from 'react';
import './Header.css'; // We'll create this CSS file

const Header = ({ isLoggedIn, user, onLogout, onNavigate, currentPage }) => {
  return (
    <header className="header">
      <div className="header-content">
        {/* Logo Section */}
        <div 
          className="logo-container" 
          onClick={() => onNavigate('home')}
        >
          <div className="logo-icon">🎤</div>
          <div className="logo-text">
            <span className="logo-main">Voice of The Youth</span>
            <span className="logo-subtitle">Empowering Young Voices</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <button 
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Home</span>
          </button>

          {isLoggedIn && (
            <button 
              className={`nav-link ${currentPage === 'events' ? 'active' : ''}`}
              onClick={() => onNavigate('events')}
            >
              <span className="nav-icon">📅</span>
              <span className="nav-text">Events</span>
            </button>
          )}

          {!isLoggedIn ? (
            <div className="auth-buttons">
              <button 
                className={`nav-link auth-btn login-btn ${currentPage === 'login' ? 'active' : ''}`}
                onClick={() => onNavigate('login')}
              >
                <span className="nav-icon">🔐</span>
                <span className="nav-text">Login</span>
              </button>
              <button 
                className={`nav-link auth-btn signup-btn ${currentPage === 'signup' ? 'active' : ''}`}
                onClick={() => onNavigate('signup')}
              >
                <span className="nav-icon">✨</span>
                <span className="nav-text">Sign Up</span>
              </button>
            </div>
          ) : (
            <div className="user-section">
              <div className="user-welcome">
                <span className="welcome-icon">👋</span>
                <span className="welcome-text">
                  Welcome back, <span className="user-name">{user?.firstName}</span>!
                </span>
              </div>
              <button 
                className="logout-btn"
                onClick={onLogout}
              >
                <span className="logout-icon">🚪</span>
                <span className="logout-text">Log Out</span>
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;