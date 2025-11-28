import React, { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Events from './components/Events';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

// Real Firebase authentication functions
const realSignIn = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Get additional user data from Firestore
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  const userData = userDoc.data();
  
  return {
    user: {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      joinDate: userData?.joinDate || new Date().toLocaleDateString(),
      isAdmin: userData?.isAdmin || false
    }
  };
};

const realSignUp = async (email, password, firstName, lastName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Set admin role for specific email or condition
  const isAdmin = email === 'admin@voy.com' || email.includes('admin');
  
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: `${firstName} ${lastName}`,
    firstName: firstName,
    lastName: lastName,
    joinDate: new Date().toLocaleDateString(),
    isAdmin: isAdmin,
    createdAt: new Date().toISOString()
  };
  
  // Save user data to Firestore
  await setDoc(doc(db, 'users', user.uid), userData);
  
  return {
    user: userData
  };
};

const realSignOut = () => {
  return signOut(auth);
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsLoggedIn(true);
            setUser(userData);
            if (userData.isAdmin) {
              setIsAdmin(true);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem('voyCurrentUser');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    
    if (userData.isAdmin) {
      setIsAdmin(true);
    }
    
    setCurrentPage('home');
  };

  const handleSignUp = async (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    
    if (userData.isAdmin) {
      setIsAdmin(true);
    }
    
    setCurrentPage('home');
  };

  const handleLogout = async () => {
    try {
      await realSignOut();
      setIsLoggedIn(false);
      setUser(null);
      setIsAdmin(false);
      setCurrentPage('home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Update Login and SignUp components to use real Firebase functions
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
            signInFunction={realSignIn}
          />
        );
      case 'signup':
        return (
          <SignUp 
            onSignUp={handleSignUp} 
            onSwitchToLogin={() => setCurrentPage('login')}
            signUpFunction={realSignUp}
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