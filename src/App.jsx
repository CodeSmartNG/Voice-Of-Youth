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
            displayName: user.displayName,
            firstName: user.firstName,
            lastName: user.lastName,
            joinDate: user.joinDate,
            isAdmin: user.isAdmin
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
        // Set admin role for specific email or condition
        const isAdmin = email === 'admin@voy.com' || email.includes('admin');
        
        const newUser = {
          uid: 'user-' + Date.now(),
          email: email,
          password: password, // In real app, never store passwords like this
          displayName: `${firstName} ${lastName}`,
          firstName: firstName,
          lastName: lastName,
          joinDate: new Date().toLocaleDateString(),
          isAdmin: isAdmin
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
const Header = ({ isLoggedIn, isAdmin, user, onLogout, onNavigate, currentPage }) => {
  return (
    <header className="header">
      <div className="header-content">
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

          {isAdmin && (
            <button 
              className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`}
              onClick={() => onNavigate('admin')}
            >
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">Admin</span>
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
                  Welcome, <span className="user-name">{user?.firstName}</span>!
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
        firstName: user.firstName,
        lastName: user.lastName,
        joinDate: user.joinDate,
        isAdmin: user.isAdmin
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
        joinDate: user.joinDate,
        isAdmin: user.isAdmin
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

// Admin Dashboard Component
const AdminDashboard = ({ isAdmin, user }) => {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    media: null,
    mediaType: 'image'
  });
  const [loading, setLoading] = useState(false);

  // Load posts from localStorage on component mount
  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('voyPosts') || '[]');
    setPosts(savedPosts);
  }, []);

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    localStorage.setItem('voyPosts', JSON.stringify(posts));
  }, [posts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          media: e.target.result,
          mediaType: file.type.startsWith('video') ? 'video' : 'image'
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const newPost = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        media: formData.media,
        mediaType: formData.mediaType,
        createdAt: new Date().toISOString(),
        author: user?.displayName || 'Admin',
        likes: 0,
        shares: 0
      };

      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        media: null,
        mediaType: 'image'
      });
      setShowForm(false);
      
      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);
    }
  };

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="admin-dashboard">
        <div className="access-denied">
          <h2>🔒 Access Denied</h2>
          <p>You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage content and posts for Voice of Youth</p>
      </div>

      <div className="admin-content">
        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-number">{posts.length}</div>
            <div className="stat-label">Total Posts</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {posts.filter(post => post.mediaType === 'image').length}
            </div>
            <div className="stat-label">Image Posts</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {posts.filter(post => post.mediaType === 'video').length}
            </div>
            <div className="stat-label">Video Posts</div>
          </div>
        </div>

        {/* Create Post Button */}
        <div className="action-bar">
          <button 
            className="create-post-btn"
            onClick={() => setShowForm(true)}
          >
            📝 Create New Post
          </button>
        </div>

        {/* Create Post Form */}
        {showForm && (
          <div className="post-form-overlay">
            <div className="post-form">
              <div className="form-header">
                <h2>Create New Post</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Post Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter post title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter post description"
                    rows="4"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Media Upload</label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaChange}
                  />
                  <small>Supported formats: Images (JPG, PNG) and Videos (MP4, MOV)</small>
                </div>

                {formData.media && (
                  <div className="media-preview">
                    <label>Preview:</label>
                    {formData.mediaType === 'image' ? (
                      <img src={formData.media} alt="Preview" />
                    ) : (
                      <video controls>
                        <source src={formData.media} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Publishing...' : 'Publish Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div className="posts-list">
          <h3>Recent Posts ({posts.length})</h3>
          
          {posts.length === 0 ? (
            <div className="no-posts">
              <p>No posts yet. Create your first post!</p>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map(post => (
                <div key={post.id} className="post-card">
                  {post.media && (
                    <div className="post-media">
                      {post.mediaType === 'image' ? (
                        <img src={post.media} alt={post.title} />
                      ) : (
                        <video controls>
                          <source src={post.media} type="video/mp4" />
                        </video>
                      )}
                    </div>
                  )}
                  
                  <div className="post-content">
                    <h4>{post.title}</h4>
                    <p>{post.description}</p>
                    <div className="post-meta">
                      <span>By {post.author}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="post-actions">
                    <button 
                      className="delete-btn"
                      onClick={() => deletePost(post.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Home Component
const Home = ({ user, isLoggedIn }) => {
  const whatsappLink = "https://whatsapp.com/channel/0029VbBEuroC6ZviEtcvcD0G";

  const handleJoinClick = () => {
    window.open(whatsappLink, '_blank');
  };

  const stats = [
    { number: "5000+", label: "Active Members" },
    { number: "50+", label: "Events Hosted" },
    { number: "21+", label: "States Reached" },
    { number: "200+", label: "Communities Impacted" }
  ];

  const features = [
    {
      icon: "🌍",
      title: "Our Mission",
      description: "To empower young people through education, entrepreneurship, and leadership — helping them build a brighter future for themselves and their communities."
    },
    {
      icon: "🎤",
      title: "Speak Up",
      description: "Share your ideas, opinions, and concerns in a safe and supportive environment. Your voice matters and deserves to be heard."
    },
    {
      icon: "🤝",
      title: "Connect",
      description: "Meet like-minded young people passionate about making positive changes in their communities and beyond."
    },
    {
      icon: "🚀",
      title: "Take Action",
      description: "Turn your ideas into reality with our support. Start projects, join campaigns, and create meaningful change."
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">Empowering Young Leaders</div>
          <h1 className="hero-title">
            Voice of <span className="hero-highlight">The Youth</span>
          </h1>
          <p className="hero-subtitle">
            Empowering the next generation to speak up, take action, and create meaningful change in their communities.
          </p>
          <div className="hero-actions">
            {!isLoggedIn && (
              <button className="cta-button primary" onClick={handleJoinClick}>
                <span className="btn-icon">🌟</span>
                Join Our Movement
              </button>
            )}
            <button className="cta-button secondary" onClick={handleJoinClick}>
              <span className="btn-icon">📱</span>
              WhatsApp Channel
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Message for Logged-in Users */}
      {isLoggedIn && (
        <section className="welcome-section">
          <div className="container">
            <div className="welcome-card">
              <div className="welcome-header">
                <div className="welcome-icon">👋</div>
                <div className="welcome-text">
                  <h2>Welcome back, <span className="user-name">{user?.firstName || user?.displayName || user?.email}</span>!</h2>
                  <p>Member since {user?.joinDate || '2024'}</p>
                </div>
              </div>
              <p className="welcome-message">
                We're thrilled to have you as part of our growing community. Together, we're building a brighter future for youth everywhere.
              </p>
              <button className="cta-button whatsapp" onClick={handleJoinClick}>
                <span className="btn-icon">💬</span>
                Connect on WhatsApp
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>How We Empower Youth</h2>
            <p>Four pillars of our approach to youth development and community impact</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-header">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                </div>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>
              Join thousands of young changemakers in our WhatsApp community. Get updates on events, 
              opportunities, and be part of the conversation shaping our future.
            </p>
            <button className="cta-button large whatsapp" onClick={handleJoinClick}>
              <span className="btn-icon">📱</span>
              Join WhatsApp Channel
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About Voice of Youth</h2>
              <p>
                Voice of Youth is a dynamic global association dedicated to empowering young people aged 15-25 
                to become active citizens and visionary leaders in their communities. We provide innovative platforms 
                for meaningful dialogue, practical tools for action, and extensive networks for collaboration to 
                help young voices shape our collective future.
              </p>
              <div className="about-stats">
                <div className="about-stat">
                  <strong>Founded:</strong> 2024
                </div>
                <div className="about-stat">
                  <strong>Focus:</strong> Youth Empowerment & Development
                </div>
                <div className="about-stat">
                  <strong>Impact:</strong> Global Reach, Local Action
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('voyCurrentUser'));
    if (currentUser) {
      setIsLoggedIn(true);
      setUser(currentUser);
      if (currentUser.isAdmin) {
        setIsAdmin(true);
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('voyCurrentUser', JSON.stringify(userData));
    
    if (userData.isAdmin) {
      setIsAdmin(true);
    }
    
    setCurrentPage('home');
  };

  const handleSignUp = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('voyCurrentUser', JSON.stringify(userData));
    
    if (userData.isAdmin) {
      setIsAdmin(true);
    }
    
    setCurrentPage('home');
  };

  const handleLogout = async () => {
    try {
      await mockSignOut();
      setIsLoggedIn(false);
      setUser(null);
      setIsAdmin(false);
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
      case 'admin':
        return <AdminDashboard isAdmin={isAdmin} user={user} />;
      default:
        return <Home user={user} isLoggedIn={isLoggedIn} />;
    }
  };

  return (
    <div className="App">
      <Header 
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
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
