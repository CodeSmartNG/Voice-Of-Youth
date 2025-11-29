import React from "react";
import './ErrorBoundary.css';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console
    console.error('Error Boundary Caught:', error, errorInfo);
    
    // You can also log to an error reporting service here
    // logErrorToService(error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  renderErrorContent() {
    const { error, errorInfo } = this.state;
    const { fallback } = this.props;

    // Use custom fallback if provided
    if (fallback) {
      return React.isValidElement(fallback) 
        ? fallback 
        : <div>{fallback}</div>;
    }

    return (
      <div className="error-boundary">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h1 className="error-title">Something went wrong</h1>
          <p className="error-message">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          
          {/* Error details for development */}
          {process.env.NODE_ENV === 'development' && error && (
            <details className="error-details">
              <summary>Error Details (Development)</summary>
              <div className="error-stack">
                <strong>{error.toString()}</strong>
                <pre>{errorInfo?.componentStack}</pre>
              </div>
            </details>
          )}

          <div className="error-actions">
            <button 
              onClick={this.handleReset}
              className="btn btn-primary"
            >
              Try Again
            </button>
            <button 
              onClick={this.handleReload}
              className="btn btn-secondary"
            >
              Reload Page
            </button>
            <button 
              onClick={this.handleGoHome}
              className="btn btn-outline"
            >
              Go Home
            </button>
          </div>

          <div className="error-help">
            <p>If the problem persists, please contact support.</p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.renderErrorContent();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;