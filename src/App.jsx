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
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import Notification from './components/Notification';
import './App.css';

// Enhanced Authentication functions
const localSignIn = async (email, password) => {
  try {
    const user = userStorage.findUserByEmail(email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.password !== password) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    userStorage.updateUser(user.email, user);

    // Don't return password in user object
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      success: true
    };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

const localSignUp = async (email, password, firstName, lastName) => {
  try {
    // Check if user already exists
    const existingUser = userStorage.findUserByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const isAdmin = email === 'admin@voy.com' || email.includes('admin');

    const userData = {
      email,
      password, // In real app, this would be hashed
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      isAdmin,
      joinDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      userId: `user_${Date.now()}`,
      profileCompleted: false,
      preferences: {
        notifications: true,
        newsletter: true
      }
    };

    const newUser = userStorage.createUser(userData);

    // Update analytics
    analyticsStorage.incrementStat('totalUsers');
    analyticsStorage.incrementStat('registrationsToday');
    analyticsStorage.incrementStat('totalRegistrations');

    // Don't return password
    const { password: _, ...userWithoutPassword } = newUser;

    return {
      user: userWithoutPassword,
      success: true
    };
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

const localSignOut = async () => {
  try {
    // Track logout in analytics
    const currentUser = sessionStorage.getCurrentUser();
    if (currentUser) {
      analyticsStorage.incrementStat('totalLogouts');
    }
    
    sessionStorage.clearSession();
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [appError, setAppError] = useState(null);

  // Enhanced notification system
  const showNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now().toString();
    setNotification({ id, message, type });
    
    if (duration > 0) {
      setTimeout(() => {
        setNotification(current => current?.id === id ? null : current);
      }, duration);
    }
  };

  // Clear notification
  const clearNotification = () => {
    setNotification(null);
  };

  // Enhanced error handler
  const handleError = (error, context = 'App') => {
    console.error(`${context} Error:`, error);
    
    const userMessage = error.message || 'An unexpected error occurred';
    setAppError(userMessage);
    showNotification(userMessage, 'error');
    
    // Log to analytics if available
    if (analyticsStorage?.recordError) {
      analyticsStorage.recordError({
        context,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Initialize application
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        setAppError(null);

        // Check for existing session
        const currentUser = sessionStorage.getCurrentUser();
        
        if (currentUser) {
          // Verify user still exists in storage
          const userExists = userStorage.findUserByEmail(currentUser.email);
          
          if (userExists) {
            setIsLoggedIn(true);
            setUser(currentUser);
            setIsAdmin(currentUser.isAdmin || false);
            
            // Update user activity
            analyticsStorage.incrementStat('dailyLogins');
            analyticsStorage.incrementStat('totalLogins');
            
            showNotification(`Welcome back, ${currentUser.firstName}!`, 'success', 3000);
          } else {
            // User no longer exists in database
            sessionStorage.clearSession();
            showNotification('Session expired. Please log in again.', 'warning');
          }
        }

        // Initialize analytics if needed
        const stats = analyticsStorage.getStats();
        if (!stats.initialized) {
          analyticsStorage.initializeStats();
        }

      } catch (error) {
        handleError(error, 'App Initialization');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Enhanced login handler
  const handleLogin = async (userData) => {
    try {
      setIsLoggedIn(true);
      setUser(userData);
      setAppError(null);
      
      sessionStorage.setCurrentUser(userData);
      setIsAdmin(userData.isAdmin || false);

      // Update analytics
      analyticsStorage.incrementStat('totalLogins');
      analyticsStorage.incrementStat('dailyLogins');
      analyticsStorage.incrementStat('activeSessions');

      setCurrentPage('home');
      showNotification(`Welcome back, ${userData.firstName}!`, 'success', 4000);
      
    } catch (error) {
      handleError(error, 'Login Handler');
    }
  };

  // Enhanced signup handler
  const handleSignUp = async (userData) => {
    try {
      setIsLoggedIn(true);
      setUser(userData);
      setAppError(null);
      
      sessionStorage.setCurrentUser(userData);
      setIsAdmin(userData.isAdmin || false);

      setCurrentPage('home');
      showNotification(`Welcome to Voice of The Youth, ${userData.firstName}!`, 'success', 5000);
      
    } catch (error) {
      handleError(error, 'Signup Handler');
    }
  };

  // Enhanced logout handler
  const handleLogout = async () => {
    try {
      await localSignOut();
      
      setIsLoggedIn(false);
      setUser(null);
      setIsAdmin(false);
      setAppError(null);
      
      setCurrentPage('home');
      showNotification('You have been logged out successfully', 'info', 3000);
      
    } catch (error) {
      handleError(error, 'Logout Handler');
    }
  };

  // Enhanced navigation handler
  const handleNavigation = (page) => {
    try {
      setCurrentPage(page);
      setAppError(null);
      
      // Track page views for analytics (excluding auth pages)
      if (page !== 'login' && page !== 'signup') {
        analyticsStorage.incrementStat('pageViews');
        analyticsStorage.recordPageView(page);
      }
      
    } catch (error) {
      handleError(error, 'Navigation Handler');
    }
  };

  // Enhanced page renderer with error boundaries
  const renderPage = () => {
    if (loading) {
      return <LoadingSpinner message="Loading Voice of The Youth..." />;
    }

    // Show error page if critical app error exists
    if (appError && currentPage !== 'login' && currentPage !== 'signup') {
      return (
        <div className="error-page">
          <div className="error-content">
            <h1>⚠️ Application Error</h1>
            <p>{appError}</p>
            <div className="error-actions">
              <button 
                onClick={() => setAppError(null)}
                className="btn-primary"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="btn-secondary"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    try {
      switch (currentPage) {
        case 'login':
          return (
            <ErrorBoundary>
              <Login 
                onLogin={handleLogin} 
                onSwitchToSignUp={() => handleNavigation('signup')}
                signInFunction={localSignIn}
                onShowNotification={showNotification}
                onError={handleError}
              />
            </ErrorBoundary>
          );
          
        case 'signup':
          return (
            <ErrorBoundary>
              <SignUp 
                onSignUp={handleSignUp} 
                onSwitchToLogin={() => handleNavigation('login')}
                signUpFunction={localSignUp}
                onShowNotification={showNotification}
                onError={handleError}
              />
            </ErrorBoundary>
          );
          
        case 'events':
          if (!isLoggedIn) {
            showNotification('Please log in to view events', 'warning');
            handleNavigation('home');
            return null;
          }
          return (
            <ErrorBoundary>
              <Events user={user} />
            </ErrorBoundary>
          );
          
        case 'admin':
          if (!isAdmin) {
            showNotification('Access denied. Admin privileges required.', 'error');
            handleNavigation('home');
            return null;
          }
          return (
            <ErrorBoundary>
              <AdminDashboard isAdmin={isAdmin} user={user} />
            </ErrorBoundary>
          );
          
        default:
          return (
            <ErrorBoundary>
              <Home user={user} isLoggedIn={isLoggedIn} />
            </ErrorBoundary>
          );
      }
    } catch (error) {
      handleError(error, 'Page Render');
      return (
        <div className="error-page">
          <div className="error-content">
            <h1>Page Load Error</h1>
            <p>Failed to load the requested page.</p>
            <button 
              onClick={() => handleNavigation('home')}
              className="btn-primary"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <ErrorBoundary>
      <div className="App">
        {/* Global Notification */}
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={clearNotification}
          />
        )}

        {/* Header */}
        <Header 
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigation}
          currentPage={currentPage}
        />
        
        {/* Main Content */}
        <main className="main-content">
          {renderPage()}
        </main>

        {/* Global Error Overlay */}
        {appError && (
          <div className="global-error-overlay">
            <div className="error-panel">
              <h3>Application Issue</h3>
              <p>{appError}</p>
              <button 
                onClick={() => setAppError(null)}
                className="btn-primary"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;