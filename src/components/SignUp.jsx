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
  const [passwordStrength, setPasswordStrength] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');

    // Check password strength in real-time
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength('');
      return;
    }

    if (password.length < 6) {
      setPasswordStrength('weak');
    } else if (password.length < 8) {
      setPasswordStrength('medium');
    } else {
      // Check for complexity
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      const complexityScore = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

      if (complexityScore >= 3) {
        setPasswordStrength('strong');
      } else {
        setPasswordStrength('medium');
      }
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'weak':
        return { text: 'Weak', color: '#e63946' };
      case 'medium':
        return { text: 'Medium', color: '#f8961e' };
      case 'strong':
        return { text: 'Strong', color: '#4cc9f0' };
      default:
        return { text: '', color: 'transparent' };
    }
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      return 'Please fill in your first and last name';
    }

    if (!formData.email) {
      return 'Please enter your email address';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address';
    }

    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords don't match!";
    }

    if (!acceptTerms) {
      return 'Please accept the Terms of Service and Privacy Policy';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
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
      if (error.message.includes('Email already exists')) {
        setError('This email is already registered. Please use a different email or sign in.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrengthText();

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2 className="auth-title">✨ Join Our Community</h2>
        <p className="auth-subtitle">Create your Voice of Youth account and start making a difference</p>
      </div>
      
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
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
              autoComplete="given-name"
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
              autoComplete="family-name"
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
            autoComplete="email"
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
            placeholder="Create a secure password"
            minLength="6"
            required
            disabled={loading}
            autoComplete="new-password"
          />
          {passwordStrength && (
            <div className="password-strength">
              <span>Password strength: </span>
              <span style={{ color: strength.color, fontWeight: 'bold' }}>
                {strength.text}
              </span>
              <div 
                className="strength-bar"
                style={{ 
                  backgroundColor: strength.color,
                  width: passwordStrength === 'weak' ? '33%' : 
                         passwordStrength === 'medium' ? '66%' : '100%'
                }}
              ></div>
            </div>
          )}
          <small className="form-help">
            Must be at least 6 characters. Include uppercase, lowercase, numbers, and symbols for a stronger password.
          </small>
        </div>

        <div className="form-group">
          <label className="form-label">✅ Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            className="form-input"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            required
            disabled={loading}
            autoComplete="new-password"
          />
          {formData.confirmPassword && formData.password === formData.confirmPassword && (
            <small className="form-success">✓ Passwords match</small>
          )}
        </div>

        <div className="form-options">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              disabled={loading}
              required
            />
            <span className="checkmark"></span>
            I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a> *
          </label>
        </div>

        <button 
          type="submit" 
          className={`auth-btn ${loading ? 'loading' : ''}`}
          disabled={loading || !acceptTerms}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Creating Your Account...
            </>
          ) : (
            'Create My Account'
          )}
        </button>
      </form>

      <div className="auth-divider">
        <span>Already have an account?</span>
      </div>

      <div className="auth-switch">
        <button 
          className="switch-btn secondary"
          onClick={onSwitchToLogin}
          disabled={loading}
        >
          Sign In to Existing Account
        </button>
      </div>

      <div className="auth-benefits">
        <h4>🎯 What you'll get:</h4>
        <ul className="benefits-list">
          <li>✓ Access to exclusive youth events and workshops</li>
          <li>✓ Connect with mentors and like-minded peers</li>
          <li>✓ Share your projects and get community support</li>
          <li>✓ Leadership development opportunities</li>
          <li>✓ Early access to new programs and initiatives</li>
        </ul>
      </div>
    </div>
  );
};

export default SignUp;