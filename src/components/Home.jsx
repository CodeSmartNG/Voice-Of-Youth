import React from 'react';

const Home = ({ user, isLoggedIn }) => {
  const whatsappLink = "  https://whatsapp.com/channel/0029VbBEuroC6ZviEtcvcD0G "; // Replace with your actual WhatsApp number

  const handleJoinClick = () => {
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Voice of The Youth</h1>
        <p className="hero-subtitle">
          Empowering the next generation to speak up, take action, and create change.
        </p>
        {!isLoggedIn && (
          <button 
            className="cta-button"
            onClick={handleJoinClick}
          >
            Join Our Movement
          </button>
        )}
      </section>

      {/* Welcome Message for Logged-in Users */}
      {isLoggedIn && (
        <div className="welcome-message">
          <h2 className="welcome-text">
            Welcome back, <span className="user-name">{user?.displayName || user?.email}</span>!
          </h2>
          <p>We're glad to have you as part of our community. Together, we can make a difference!</p>
          
          <button 
            className="cta-button"
            onClick={handleJoinClick}
            style={{ marginTop: '1rem' }}
          >
            Connect on WhatsApp
          </button>
        </div>
      )}

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">📢</div>
          <h3 className="feature-title">Aims and Objectives</h3>
          <p className="feature-description">
 Our Mission
To empower young people through education, entrepreneurship, and leadership — helping them build a brighter future for themselves and their communities.<br/>

 Unity and Community Building

We promote unity and collaboration among youth to create a peaceful, progressive, and responsible society.
<br/>

Skills & Opportunities

We provide training, mentorship, and access to business and career opportunities so that young people can become self-reliant and successful.
<br/>
 Youth Rights & Advocacy

We stand for the rights of young people in politics, the economy, and social development — ensuring their voices are heard and respected.
<br/>
 Economic Empowerment

We believe youth can drive economic growth.
By learning modern skills and embracing digital tools like e-commerce, freelancing, and coding, they can create jobs and build successful enterprises.
<br/>
 Education & Technology

Education is power!
We encourage learning in technology, coding, AI, and blockchain, and we promote platforms like YouTube, blogs, and online courses to share knowledge and skills.<br/>

Leadership & Governance

We inspire youth to take active roles in leadership and politics — bringing fresh ideas, integrity, and innovation to solve community challenges.<br/>

 Social & Moral Development

We promote good values, discipline, peace, and cooperation within families and communities.
Our goal is to build a society based on honesty, fairness, and mutual support.<br/>

 Environment & Sustainable Growth

We engage youth in protecting the environment — through reforestation, reducing pollution, and adopting modern, eco-friendly farming methods to support food security and national growth.

          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🤝</div>
          <h3 className="feature-title">Connect</h3>
          <p className="feature-description">
            Meet like-minded young people who are passionate about making positive changes 
            in their communities and beyond.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🚀</div>
          <h3 className="feature-title">Take Action</h3>
          <p className="feature-description">
            Turn your ideas into reality with our support. Start projects, join campaigns, 
            and create the change you want to see in the world.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section style={{ textAlign: 'center', padding: '3rem 0' }}>
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>About Voice of Youth</h2>
        <p style={{ color: '#666', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
          Voice of Youth is a global association dedicated to empowering young people aged 15-25 
          to become active citizens and leaders in their communities. We provide platforms for 
          dialogue, tools for action, and networks for collaboration to help young voices shape 
          our collective future.
        </p>
      </section>
    </div>
  );
};

export default Home;