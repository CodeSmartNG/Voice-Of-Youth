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
    joinDate: new Date().toLocaleDateString()
  };

  const newUser = userStorage.createUser(userData);
  
  // Update stats
  analyticsStorage.incrementStat('totalUsers');
  
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

  // Check if user is logged in on app start
  useEffect(() => {
    const currentUser = sessionStorage.getCurrentUser();
    if (currentUser) {
      setIsLoggedIn(true);
      setUser(currentUser);
      if (currentUser.isAdmin) {
        setIsAdmin(true);
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    sessionStorage.setCurrentUser(userData);
    
    if (userData.isAdmin) {
      setIsAdmin(true);
    }
    
    setCurrentPage('home');
  };

  const handleSignUp = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    sessionStorage.setCurrentUser(userData);
    
    if (userData.isAdmin) {
      setIsAdmin(true);
    }
    
    setCurrentPage('home');
  };

  const handleLogout = async () => {
    try {
      await localSignOut();
      setIsLoggedIn(false);
      setUser(null);
      setIsAdmin(false);
      setCurrentPage('home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderPage = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      );
    }

    switch (currentPage) {
      case 'login':
        return (
          <Login 
            onLogin={handleLogin} 
            onSwitchToSignUp={() => setCurrentPage('signup')}
            signInFunction={localSignIn}
          />
        );
      case 'signup':
        return (
          <SignUp 
            onSignUp={handleSignUp} 
            onSwitchToLogin={() => setCurrentPage('login')}
            signUpFunction={localSignUp}
          />
        );
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