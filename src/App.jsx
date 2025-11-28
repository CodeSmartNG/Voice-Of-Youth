import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Events from './components/Events';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

// Mock Firebase functions (keep these in App.jsx)
const mockAuth = {
  currentUser: null
};

const mockSignIn = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
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
      const users = JSON.parse(localStorage.getItem('voyUsers') || '[]');
      const existingUser = users.find(u => u.email === email);

      if (existingUser) {
        reject(new Error('Email already exists'));
      } else {
        const isAdmin = email === 'admin@voy.com' || email.includes('admin');
        
        const newUser = {
          uid: 'user-' + Date.now(),
          email: email,
          password: password,
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

// Events Component (if you don't have Events.jsx yet)
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