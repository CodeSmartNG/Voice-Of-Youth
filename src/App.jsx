// Add this to your existing App.js state
const [isAdmin, setIsAdmin] = useState(false);

// Update the handleLogin function
const handleLogin = (userData) => {
  setIsLoggedIn(true);
  setUser(userData);
  localStorage.setItem('voyCurrentUser', JSON.stringify(userData));
  
  // Check if user is admin (you can set this during signup or have a predefined list)
  if (userData.email === 'admin@voy.com' || userData.uid === 'admin') {
    setIsAdmin(true);
  }
  
  setCurrentPage('home');
};

// Update the handleLogout function
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

// Add admin page to your renderPage function
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

// Update Header component props to include isAdmin
<Header 
  isLoggedIn={isLoggedIn}
  isAdmin={isAdmin}
  user={user}
  onLogout={handleLogout}
  onNavigate={setCurrentPage}
  currentPage={currentPage}
/>