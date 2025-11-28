import React from 'react';
import './Home.css'; // We'll create this CSS file

const Home = ({ user, isLoggedIn }) => {
  const whatsappLink = "https://whatsapp.com/channel/0029VbBEuroC6ZviEtcvcD0G";

  const handleJoinClick = () => {
    window.open(whatsappLink, '_blank');
  };

  const stats = [
    { number: "5000+", label: "Active Members" },
    { number: "50+", label: "Events Hosted" },
    { number: "21+", label: "States Reached" },
    { number: "200+", label: "Communities Impacted" }
  ];

  const objectives = [
    {
      icon: "🎯",
      title: "Our Mission",
      description: "To empower young people through education, entrepreneurship, and leadership — helping them build a brighter future for themselves and their communities."
    },
    {
      icon: "🤝",
      title: "Unity & Community",
      description: "We promote unity and collaboration among youth to create a peaceful, progressive, and responsible society."
    },
    {
      icon: "💼",
      title: "Skills & Opportunities",
      description: "We provide training, mentorship, and access to business and career opportunities for self-reliance and success."
    },
    {
      icon: "⚖️",
      title: "Youth Rights & Advocacy",
      description: "We stand for youth rights in politics, economy, and social development — ensuring their voices are heard and respected."
    },
    {
      icon: "📈",
      title: "Economic Empowerment",
      description: "Youth can drive economic growth through modern skills, digital tools, e-commerce, freelancing, and entrepreneurship."
    },
    {
      icon: "💻",
      title: "Education & Technology",
      description: "We promote learning in technology, coding, AI, blockchain, and digital content creation through online platforms."
    },
    {
      icon: "👑",
      title: "Leadership & Governance",
      description: "We inspire youth to take active roles in leadership and politics with fresh ideas, integrity, and innovation."
    },
    {
      icon: "🌱",
      title: "Social & Moral Values",
      description: "We promote good values, discipline, peace, and cooperation within families and communities."
    },
    {
      icon: "🌍",
      title: "Environment & Sustainability",
      description: "We engage youth in environmental protection, reforestation, and eco-friendly farming for sustainable growth."
    }
  ];

  const features = [
    {
      icon: "📢",
      title: "Speak Up",
      description: "Share your ideas, opinions, and concerns in a safe and supportive environment. Your voice matters and deserves to be heard."
    },
    {
      icon: "🤝",
      title: "Connect",
      description: "Meet like-minded young people passionate about making positive changes in their communities and beyond."
    },
    {
      icon: "🚀",
      title: "Take Action",
      description: "Turn your ideas into reality with our support. Start projects, join campaigns, and create meaningful change."
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">Empowering Young Leaders</div>
          <h1 className="hero-title">
            Voice of <span className="hero-highlight">The Youth</span>
          </h1>
          <p className="hero-subtitle">
            Empowering the next generation to speak up, take action, and create meaningful change in their communities.
          </p>
          <div className="hero-actions">
            {!isLoggedIn && (
              <button className="cta-button primary" onClick={handleJoinClick}>
                <span className="btn-icon">🌟</span>
                Join Our Movement
              </button>
            )}
            <button className="cta-button secondary" onClick={handleJoinClick}>
              <span className="btn-icon">📱</span>
              WhatsApp Channel
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Message for Logged-in Users */}
      {isLoggedIn && (
        <section className="welcome-section">
          <div className="container">
            <div className="welcome-card">
              <div className="welcome-header">
                <div className="welcome-icon">👋</div>
                <div className="welcome-text">
                  <h2>Welcome back, <span className="user-name">{user?.firstName || user?.displayName || user?.email}</span>!</h2>
                  <p>Member since {user?.joinDate || '2024'}</p>
                </div>
              </div>
              <p className="welcome-message">
                We're thrilled to have you as part of our growing community. Together, we're building a brighter future for youth everywhere.
              </p>
              <button className="cta-button whatsapp" onClick={handleJoinClick}>
                <span className="btn-icon">💬</span>
                Connect on WhatsApp
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Aims & Objectives Section */}
      <section className="objectives-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Vision & Mission</h2>
            <p>Comprehensive youth empowerment through education, technology, and community development</p>
          </div>
          <div className="objectives-grid">
            {objectives.map((objective, index) => (
              <div key={index} className="objective-card">
                <div className="objective-icon">{objective.icon}</div>
                <h3 className="objective-title">{objective.title}</h3>
                <p className="objective-description">{objective.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>How We Empower Youth</h2>
            <p>Three pillars of our approach to youth development and community impact</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-header">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                </div>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>
              Join thousands of young changemakers in our WhatsApp community. Get updates on events, 
              opportunities, and be part of the conversation shaping our future.
            </p>
            <button className="cta-button large whatsapp" onClick={handleJoinClick}>
              <span className="btn-icon">📱</span>
              Join WhatsApp Channel
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About Voice of Youth</h2>
              <p>
                Voice of Youth is a dynamic global association dedicated to empowering young people aged 15-25 
                to become active citizens and visionary leaders in their communities. We provide innovative platforms 
                for meaningful dialogue, practical tools for action, and extensive networks for collaboration to 
                help young voices shape our collective future.
              </p>
              <div className="about-stats">
                <div className="about-stat">
                  <strong>Founded:</strong> 2024
                </div>
                <div className="about-stat">
                  <strong>Focus:</strong> Youth Empowerment & Development
                </div>
                <div className="about-stat">
                  <strong>Impact:</strong> Global Reach, Local Action
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;