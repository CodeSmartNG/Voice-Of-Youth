import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h1># Error loading application</h1>
            <h2>Empowering Young Voices</h2>
            <div className="divider"></div>
            <h3>Empowering Young Leaders</h3>
            <h2>Voice of The Youth</h2>
            <p>Empowering the next generation to speak up, take action, and create meaningful change in their communities.</p>
            <div className="divider"></div>
            <div className="action-buttons">
              <button onClick={() => window.location.reload()} className="btn-primary">
                Reload Application
              </button>
              <button onClick={() => this.setState({ hasError: false })} className="btn-secondary">
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;