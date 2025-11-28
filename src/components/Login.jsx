import React, { useState } from 'react';

const Login = ({ onLogin, onSwitchToSignUp, signInFunction }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await signInFunction(formData.email, formData.password);
      const user = userCredential.user;
      
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      
      onLogin(user);
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else if (error.code === 'auth/user-disabled') {
        setError('This account has been disabled. Please contact support.');
      } else {
        setError('Failed to login. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // You can implement password reset functionality here
    alert('Password reset feature coming soon!');
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">🔐 Login to Voice of Youth</h2>
      <p className="auth-subtitle">Welcome back! Please enter your details</p>
      
      {error && (
        <div className="error-message">
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
            Remember me
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
            'Sign In'
          )}
        </button>
      </form>

      <div className="auth-divider">
        <span>Or continue with</span>
      </div>

      {/* Social login buttons - you can implement these later */}
      <div className="social-login">
        <button className="social-btn google-btn" disabled>
          <span className="social-icon">🔍</span>
          Continue with Google
        </button>
        <button className="social-btn facebook-btn" disabled>
          <span className="social-icon">👤</span>
          Continue with Facebook
        </button>
      </div>

      <div className="auth-switch">
        Don't have an account?{' '}
        <span className="switch-link" onClick={onSwitchToSignUp}>
          Sign up here
        </span>
      </div>
    </div>
  );
};

export default Login;