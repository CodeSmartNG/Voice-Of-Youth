import React, { useState, useEffect } from 'react';
import './index.css';

// Mock Firebase functions
const mockAuth = {
  currentUser: null
};

const mockSignIn = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('voyUsers') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        resolve({
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
          }
        });
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 1000);
  });
};

const mockSignUp = (email, password, firstName, lastName) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('voyUsers') || '[]');
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        reject(new Error('Email already exists'));
      } else {
        const newUser = {
          uid: 'user-' + Date.now(),
          email: email,
          password: password, // In real app, never store passwords like this
          displayName: `${firstName} ${lastName}`,
          firstName: firstName,
          lastName: lastName,
          joinDate: new Date().toLocaleDateString()
        };
        
        users.push(newUser);
        localStorage.setItem('voyUsers', JSON.stringify(users));
        
        resolve({
          user: newUser
        });
      }
    }, 1000);
  });
};

const mockSignOut = () => {
  return Promise.resolve();
};

// Header Component
const Header = ({ isLoggedIn, user, onLogout, onNavigate, currentPage }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div 
          className="logo-container" 
          onClick={() => onNavigate('home')}
        >



<div className="logo-container" onClick={() => onNavigate('home')}>
  <img 
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQor9m8e1H5NUym-VU0mHrZHllZ6z-714wCb300vbxCuCasowUWZ46mdfCn&amp;s=10" 
    alt="Voice of Youth" 
    className="logo-image"
  />
  <span className="logo-text ">Voice of Youth</span>
</div>

        </div>
        
        <nav className="nav-links">
          <button 
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            🏠 Home
          </button>
          
          {isLoggedIn && (
            <button 
              className={`nav-link ${currentPage === 'events' ? 'active' : ''}`}
              onClick={() => onNavigate('events')}
            >
              📅 Events
            </button>
          )}
          
          {!isLoggedIn ? (
            <>
              <button 
                className={`nav-link ${currentPage === 'login' ? 'active' : ''}`}
                onClick={() => onNavigate('login')}
              >
                🔐 Login
              </button>
              <button 
                className={`nav-link ${currentPage === 'signup' ? 'active' : ''}`}
                onClick={() => onNavigate('signup')}
              >
                ✨ Sign Up
              </button>
            </>
          ) : (
            <>
              <span>👋 Welcome, {user?.displayName || user?.email}!</span>
              <button 
                className="logout-btn"
                onClick={onLogout}
              >
                🚪 Log Out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

// Login Component
const Login = ({ onLogin, onSwitchToSignUp }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await mockSignIn(formData.email, formData.password);
      
      const user = userCredential.user;
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        joinDate: user.joinDate
      };
      
      onLogin(userData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">🔐 Login to Voice of Youth</h2>
      {error && <div className="error-message">{error}</div>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">📧 Email</label>
          <input
            type="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">🔒 Password</label>
          <input
            type="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-btn"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div className="auth-switch">
        Don't have an account?{' '}
        <span className="switch-link" onClick={onSwitchToSignUp}>
          Sign up here
        </span>
      </div>
    </div>
  );
};

// SignUp Component
const SignUp = ({ onSignUp, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await mockSignUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );

      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        firstName: user.firstName,
        lastName: user.lastName,
        joinDate: user.joinDate
      };

      onSignUp(userData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">✨ Join Voice of Youth</h2>
      {error && <div className="error-message">{error}</div>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">👤 First Name</label>
          <input
            type="text"
            name="firstName"
            className="form-input"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">👤 Last Name</label>
          <input
            type="text"
            name="lastName"
            className="form-input"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">📧 Email</label>
          <input
            type="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">🔒 Password</label>
          <input
            type="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password (min 6 characters)"
            minLength="6"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">✅ Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="form-input"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-btn"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      <div className="auth-switch">
        Already have an account?{' '}
        <span className="switch-link" onClick={onSwitchToLogin}>
          Login here
        </span>
      </div>
    </div>
  );
};

// Events Component
const Events = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Youth Leadership Summit",
      date: "2024-01-15",
      time: "10:00 AM",
      location: "Virtual",
      description: "Join us for a day of inspiring talks and workshops about leadership and community engagement."
    },
    {
      id: 2,
      title: "Community Service Day",
      date: "2024-01-20",
      time: "9:00 AM",
      location: "Central Park",
      description: "Make a difference in your community through various service activities and clean-up projects."
    },
    {
      id: 3,
      title: "Public Speaking Workshop",
      date: "2024-01-25",
      time: "2:00 PM",
      location: "Community Center",
      description: "Improve your public speaking skills and learn to express your ideas confidently."
    }
  ];

  return (
    <div className="events-page">
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
        📅 Upcoming Events
      </h1>
      <div className="events-grid">
        {upcomingEvents.map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.title}</h3>
            <p><strong>📅 Date:</strong> {event.date}</p>
            <p><strong>⏰ Time:</strong> {event.time}</p>
            <p><strong>📍 Location:</strong> {event.location}</p>
            <p>{event.description}</p>
            <button className="cta-button" style={{ marginTop: '1rem' }}>
              Register Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Home Component
const Home = ({ user, isLoggedIn }) => {
  const whatsappLink = " https://whatsapp.com/channel/0029VbBEuroC6ZviEtcvcD0G ";

  const handleJoinClick = () => {
    window.open(whatsappLink, '_blank');
  };

  const stats = [
    { number: "5000+", label: "Members" },
    { number: "50+", label: "Events" },
    { number: "21+", label: "State" },
    { number: "200+", label: "Local Gov." }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">🎤 Voice of Youth</h1>
        <p className="hero-subtitle">
          Empowering the next generation to speak up, take action, and create change.
        </p>
        {!isLoggedIn && (
          <button 
            className="cta-button"
            onClick={handleJoinClick}
          >
            📱 Join Our WhatsApp Group
          </button>
        )}
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Welcome Message for Logged-in Users */}
      {isLoggedIn && (
        <div className="welcome-message">
          <h2 className="welcome-text">
            👋 Welcome back, <span className="user-name">{user?.displayName || user?.email}</span>!
          </h2>
          <p>Member since: {user?.joinDate}</p>
          <p>We're glad to have you as part of our community. Together, we can make a difference!</p>
          
          <button 
            className="cta-button"
            onClick={handleJoinClick}
            style={{ marginTop: '1rem' }}
          >
            📱 Connect on WhatsApp
          </button>
        </div>
      )}

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🎤</div>
          <h3 className="feature-title">Speak Up</h3>
          <p className="feature-description">
            Share your ideas, opinions, and concerns in a safe and supportive environment. 
            Your voice matters and deserves to be heard. Join our discussion forums and speaking events.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🤝</div>
          <h3 className="feature-title">Connect</h3>
          <p className="feature-description">
            Meet like-minded young people who are passionate about making positive changes 
            in their communities and beyond. Build lifelong friendships and professional networks.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🚀</div>
          <h3 className="feature-title">Take Action</h3>
          <p className="feature-description">
            Turn your ideas into reality with our support. Start projects, join campaigns, 
            and create the change you want to see in the world through our action programs.
          </p>
        </div>
      </section>

      {/* WhatsApp CTA Section */}
      <section className="cta-section">
        <h2>Ready to Make a Difference?</h2>
        <p>Join our WhatsApp group to stay updated with our latest events, campaigns, and opportunities to get involved in meaningful projects.</p>
        <button className="cta-button whatsapp-btn" onClick={handleJoinClick}>
          📱 Join WhatsApp Group
        </button>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2>About Voice of Youth</h2>
        <p>
          Voice of Youth is a global association dedicated to empowering young people aged 15-25 
          to become active citizens and leaders in their communities. We provide platforms for 
          dialogue, tools for action, and networks for collaboration to help young voices shape 
          our collective future. Founded in 2024, we've impacted thousands of young people worldwide.
        </p>
      </section>
      <footer>
        © By Bin-Alkaseem (CodeSmartNG) 2024
      </footer>
    </div>
  );
};

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('voyCurrentUser'));
    if (currentUser) {
      setIsLoggedIn(true);
      setUser(currentUser);
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('voyCurrentUser', JSON.stringify(userData));
    setCurrentPage('home');
  };

  const handleSignUp = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('voyCurrentUser', JSON.stringify(userData));
    setCurrentPage('home');
  };

  const handleLogout = async () => {
    try {
      await mockSignOut();
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('voyCurrentUser');
      setCurrentPage('home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onLogin={handleLogin} onSwitchToSignUp={() => setCurrentPage('signup')} />;
      case 'signup':
        return <SignUp onSignUp={handleSignUp} onSwitchToLogin={() => setCurrentPage('login')} />;
      case 'events':
        return <Events />;
      default:
        return <Home user={user} isLoggedIn={isLoggedIn} />;
    }
  };

  return (
    <div className="App">
      <Header 
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;