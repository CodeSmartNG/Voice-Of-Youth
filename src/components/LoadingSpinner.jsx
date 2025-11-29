import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = "Loading...", size = "medium", overlay = false }) => {
  return (
    <div className={`loading-container ${overlay ? 'overlay' : ''}`}>
      <div className="loading-content">
        <div className={`spinner ${size}`}>
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
        </div>
        {message && (
          <div className="loading-message">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;