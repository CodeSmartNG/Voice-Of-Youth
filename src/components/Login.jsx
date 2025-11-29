import React, { useState, useEffect } from 'react';
import { sessionStorage, userStorage } from '../utils/storage';

const SignIn = ({ onLogin, onSwitchToSignUp, signInFunction }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Check for remember me on component mount
  useEffect(() => {
    const remembered = sessionStorage.getRememberMe();
    setRememberMe(remembered);
  }, []);

  // Create demo accounts if they don't exist
  useEffect(() => {
    createDemoAccounts();
  }, []);

  const createDemoAccounts = () => {
    const users = userStorage.getUsers();
    const demoAccounts = [
      {
        email: 'user@demo.com',
        password: 'demo123',
        firstName: 'Demo',
        lastName: 'User',
        displayName: 'Demo User',
        isAdmin: false,
        joinDate: new Date().toLocaleDateString()
      },
      {
        email: 'admin@demo.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'Demo',
        displayName: 'Admin Demo',
        isAdmin: true,
        joinDate: new Date().toLocaleDateString()
      }
    ];

    demoAccounts.forEach(demoAccount => {
      const existingUser = users.find(u => u.email === demoAccount.email);
      if (!existingUser) {
        userStorage.createUser(demoAccount);
      }
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleRememberMeChange = (e) => {
    const remember = e.target.checked;
    setRememberMe(remember);
    sessionStorage.setRememberMe(remember);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await signInFunction(formData.email, formData.password);
      const user = userCredential.user;
      
      onLogin(user);
    } catch (error) {
      console.error('Login error:', error);
      if (error.message.includes('Invalid email or password')) {
        setError('Invalid email or password. Please try again.');
      } else if (error.message.includes('not found')) {
        setError('No account found with this email address.');
      } else {
        setError('Failed to login. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      setError('Please enter your email address first');
      return;
    }
    
    // Simple password reset simulation
    const users = userStorage.getUsers();
    const user = users.find(u => u.email === formData.email);
    
    if (user) {
      alert(`Password reset instructions would be sent to: ${formData.email}\n\nFor demo purposes:\nEmail: ${user.email}\nPassword: ${user.password}`);
    } else {
      setError('No account found with this email address.');
    }
  };

  const handleDemoLogin = async (type) => {
    const demoAccounts = {
      user: { email: 'user@demo.com', password: 'demo123' },
      admin: { email: 'admin@demo.com', password: 'admin123' }
    };

    const demo = demoAccounts[type];
    
    // Set the form data
    setFormData(demo);
    
    // Clear any previous errors
    setError('');
    setLoading(true);

    try {
      // Wait a moment for the form to update, then submit
      setTimeout(async () => {
        try {
          const userCredential = await signInFunction(demo.email, demo.password);
          const user = userCredential.user;
          onLogin(user);
        } catch (error) {
          console.error('Demo login error:', error);
          setError(`Demo login failed: ${error.message}`);
          setLoading(false);
        }
      }, 100);
    } catch (error) {
      console.error('Demo login setup error:', error);
      setError('Failed to setup demo login');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2 className="auth-title">🔐 Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your Voice of Youth account</p>
      </div>
      
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">📧 Email Address</label>
          <input
            type="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
            disabled={loading}
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <div className="password-label-container">
            <label className="form-label">🔒 Password</label>
            <span 
              className="forgot-password-link" 
              onClick={handleForgotPassword}
            >
              Forgot password?
            </span>
          </div>
          <input
            type="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            disabled={loading}
            autoComplete="current-password"
          />
        </div>

        <div className="form-options">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              disabled={loading}
            />
            <span className="checkmark"></span>
            Remember me for 30 days
          </label>
        </div>

        <button 
          type="submit" 
          className={`auth-btn ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Signing in...
            </>
          ) : (
            'Sign In to Your Account'
          )}
        </button>
      </form>

      {/* Demo Accounts */}
      <div className="demo-accounts">
        <h4>Quick Demo Access:</h4>
        <div className="demo-buttons">
          <button 
            type="button"
            className="demo-btn user-demo"
            onClick={() => handleDemoLogin('user')}
            disabled={loading}
          >
            👤 Demo User Account
          </button>
          <button 
            type="button"
            className="demo-btn admin-demo"
            onClick={() => handleDemoLogin('admin')}
            disabled={loading}
          >
            ⚙️ Demo Admin Account
          </button>
        </div>
        <div className="demo-credentials">
          <p><strong>User Demo:</strong> user@demo.com / demo123</p>
          <p><strong>Admin Demo:</strong> admin@demo.com / admin123</p>
        </div>
      </div>

      <div className="auth-divider">
        <span>New to Voice of Youth?</span>
      </div>

      <div className="auth-switch">
        <button 
          className="switch-btn"
          onClick={onSwitchToSignUp}
          disabled={loading}
        >
          Create New Account
        </button>
      </div>

      <div className="auth-features">
        <h4>Why join Voice of Youth?</h4>
        <ul className="features-list">
          <li>🎯 Connect with like-minded youth</li>
          <li>🚀 Access exclusive events and opportunities</li>
          <li>📢 Share your ideas and make an impact</li>
          <li>🌟 Build your leadership skills</li>
        </ul>
      </div>
    </div>
  );
};

export default SignIn;