import React, { useState, useEffect } from 'react';
import { 
  userStorage, 
  sessionStorage, 
  analyticsStorage 
} from './utils/storage';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Events from './components/Events';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

// Authentication functions using localStorage
const localSignIn = async (email, password) => {
  const user = userStorage.findUserByEmail(email);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (user.password !== password) {
    throw new Error('Invalid email or password');
  }

  // Don't return password in user object
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword
  };
};

const localSignUp = async (email, password, firstName, lastName) => {
  const isAdmin = email === 'admin@voy.com' || email.includes('admin');

  const userData = {
    email,
    password, // In real app, this would be hashed
    firstName,
    lastName,
    displayName: `${firstName} ${lastName}`,
    isAdmin,
    joinDate: new Date().toLocaleDateString(),
    userId: Date.now().toString() // Add unique user ID
  };

  const newUser = userStorage.createUser(userData);

  // Update stats
  analyticsStorage.incrementStat('totalUsers');
  analyticsStorage.incrementStat('registrationsToday');

  // Don't return password
  const { password: _, ...userWithoutPassword } = newUser;

  return {
    user: userWithoutPassword
  };
};

const localSignOut = () => {
  return Promise.resolve(sessionStorage.clearSession());
};

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Show notification function
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Check if user is logged in on app start
  useEffect(() => {
    const initializeApp = () => {
      try {
        const currentUser = sessionStorage.getCurrentUser();
        if (currentUser) {
          setIsLoggedIn(true);
          setUser(currentUser);
          setIsAdmin(currentUser.isAdmin || false);
          
          // Track user activity
          analyticsStorage.incrementStat('dailyLogins');
        }
        
        // Initialize analytics if first visit
        const stats = analyticsStorage.getStats();
        if (!stats.totalUsers) {
          analyticsStorage.initializeStats();
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error loading application', 'error');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleLogin = async (userData) => {
    try {
      setIsLoggedIn(true);
      setUser(userData);
      sessionStorage.setCurrentUser(userData);
      setIsAdmin(userData.isAdmin || false);

      // Track login in analytics
      analyticsStorage.incrementStat('totalLogins');
      analyticsStorage.incrementStat('dailyLogins');

      setCurrentPage('home');
      showNotification(`Welcome back, ${userData.firstName}!`, 'success');
    } catch (error) {
      console.error('Login error:', error);
      showNotification('Error during login', 'error');
    }
  };

  const handleSignUp = async (userData) => {
    try {
      setIsLoggedIn(true);
      setUser(userData);
      sessionStorage.setCurrentUser(userData);
      setIsAdmin(userData.isAdmin || false);

      setCurrentPage('home');
      showNotification(`Welcome to Voice of The Youth, ${userData.firstName}!`, 'success');
    } catch (error) {
      console.error('Signup error:', error);
      showNotification('Error during signup', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await localSignOut();
      setIsLoggedIn(false);
      setUser(null);
      setIsAdmin(false);
      setCurrentPage('home');
      showNotification('You have been logged out successfully', 'info');
    } catch (error) {
      console.error('Error signing out:', error);
      showNotification('Error during logout', 'error');
    }
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    
    // Track page views for analytics
    if (page !== 'login' && page !== 'signup') {
      analyticsStorage.incrementStat('pageViews');
    }
  };

  const renderPage = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading Voice of The Youth...</p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'login':
        return (
          <Login 
            onLogin={handleLogin} 
            onSwitchToSignUp={() => handleNavigation('signup')}
            signInFunction={localSignIn}
            onShowNotification={showNotification}
          />
        );
      case 'signup':
        return (
          <SignUp 
            onSignUp={handleSignUp} 
            onSwitchToLogin={() => handleNavigation('login')}
            signUpFunction={localSignUp}
            onShowNotification={showNotification}
          />
        );
      case 'events':
        if (!isLoggedIn) {
          showNotification('Please log in to view events', 'warning');
          return <Home user={user} isLoggedIn={isLoggedIn} />;
        }
        return <Events user={user} />;
      case 'admin':
        if (!isAdmin) {
          showNotification('Access denied. Admin privileges required.', 'error');
          return <Home user={user} isLoggedIn={isLoggedIn} />;
        }
        return <AdminDashboard isAdmin={isAdmin} user={user} />;
      default:
        return <Home user={user} isLoggedIn={isLoggedIn} />;
    }
  };

  return (
    <div className="App">
      {/* Notification System */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span className="notification-message">{notification.message}</span>
          <button 
            className="notification-close"
            onClick={() => setNotification(null)}
          >
            ✕
          </button>
        </div>
      )}

      <Header 
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigation}
        currentPage={currentPage}
      />
      
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;