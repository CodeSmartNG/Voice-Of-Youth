import React, { useState } from 'react';

const SignUp = ({ onSignUp, onSwitchToLogin, signUpFunction }) => {
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

    if (!formData.firstName || !formData.lastName) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await signUpFunction(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );

      const user = userCredential.user;
      onSignUp(user);
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please use a different email or login.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">✨ Join Voice of Youth</h2>
      <p className="auth-subtitle">Create your account and start making a difference</p>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">👤 First Name *</label>
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
            <label className="form-label">👤 Last Name *</label>
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
        </div>

        <div className="form-group">
          <label className="form-label">📧 Email Address *</label>
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
          <label className="form-label">🔒 Password *</label>
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
          <small className="form-help">Must be at least 6 characters long</small>
        </div>

        <div className="form-group">
          <label className="form-label">✅ Confirm Password *</label>
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
          className={`auth-btn ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="auth-switch">
        Already have an account?{' '}
        <span className="switch-link" onClick={onSwitchToLogin}>
          Login here
        </span>
      </div>

      <div className="auth-terms">
        <p className="terms-text">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default SignUp;