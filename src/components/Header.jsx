import React, { useState } from 'react';
import './Header.css';

const Header = ({ isLoggedIn, isAdmin, user, onLogout, onNavigate, currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (page) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo Section */}
        <div 
          className="logo-container" 
          onClick={() => handleNavigation('home')}
        >
          <div className="logo-icon">🎤</div>
          <div className="logo-text">
            <span className="logo-main">Voice of The Youth</span>
            <span className="logo-subtitle">Empowering Young Voices</span>
          </div>
        </div>

        {/* Hamburger Menu Button */}
        <button 
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Menu Backdrop */}
        <div 
          className={`mobile-menu-backdrop ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Navigation Links */}
        <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          {/* Close Button for Mobile */}
          <button 
            className="mobile-close-btn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            ✕
          </button>

          <button 
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => handleNavigation('home')}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Home</span>
          </button>

          {isLoggedIn && (
            <button 
              className={`nav-link ${currentPage === 'events' ? 'active' : ''}`}
              onClick={() => handleNavigation('events')}
            >
              <span className="nav-icon">📅</span>
              <span className="nav-text">Events</span>
            </button>
          )}

          {isAdmin && (
            <button 
              className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`}
              onClick={() => handleNavigation('admin')}
            >
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">Admin</span>
            </button>
          )}

          {!isLoggedIn ? (
            <div className="auth-buttons">
              <button 
                className={`nav-link auth-btn login-btn ${currentPage === 'login' ? 'active' : ''}`}
                onClick={() => handleNavigation('login')}
              >
                <span className="nav-icon">🔐</span>
                <span className="nav-text">Login</span>
              </button>
              <button 
                className={`nav-link auth-btn signup-btn ${currentPage === 'signup' ? 'active' : ''}`}
                onClick={() => handleNavigation('signup')}
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
                  Welcome, <span className="user-name">{user?.firstName}</span>!
                </span>
              </div>
              <button 
                className="logout-btn"
                onClick={handleLogout}
              >
                <span className="logout-icon">🚪</span>
                <span className="logout-text">Log Out</span>
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;