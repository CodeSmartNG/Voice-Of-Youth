import React from 'react';

const Header = ({ isLoggedIn, user, onLogout, onNavigate, currentPage }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div 
          className="logo" 
          onClick={() => onNavigate('home')}
          style={{ cursor: 'pointer' }}
        >
          Voice of The Youth
        </div>
        
        <nav className="nav-links">
          <button 
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            Home
          </button>
          
          {!isLoggedIn ? (
            <>
              <button 
                className={`nav-link ${currentPage === 'login' ? 'active' : ''}`}
                onClick={() => onNavigate('login')}
              >
                Login
              </button>
              <button 
                className={`nav-link ${currentPage === 'signup' ? 'active' : ''}`}
                onClick={() => onNavigate('signup')}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <span>Welcome, {user?.firstName}!</span>
              <button 
                className="logout-btn"
                onClick={onLogout}
              >
                Log Out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;