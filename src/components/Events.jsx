import React from 'react';

const Events = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Youth Leadership Summit",
      date: "2024-01-15",
      time: "10:00 AM",
      location: "Virtual",
      description: "Join us for a day of inspiring talks and workshops about leadership and community engagement."
    },
    {
      id: 2,
      title: "Community Service Day",
      date: "2024-01-20",
      time: "9:00 AM",
      location: "Central Park",
      description: "Make a difference in your community through various service activities and clean-up projects."
    },
    {
      id: 3,
      title: "Public Speaking Workshop",
      date: "2024-01-25",
      time: "2:00 PM",
      location: "Community Center",
      description: "Improve your public speaking skills and learn to express your ideas confidently."
    },
    {
      id: 4,
      title: "Digital Skills Training",
      date: "2024-02-01",
      time: "3:00 PM",
      location: "Tech Hub",
      description: "Learn essential digital skills including coding, design, and online marketing."
    },
    {
      id: 5,
      title: "Environmental Awareness Camp",
      date: "2024-02-10",
      time: "8:00 AM",
      location: "Nature Reserve",
      description: "Participate in environmental conservation activities and learn about sustainable living."
    },
    {
      id: 6,
      title: "Career Guidance Seminar",
      date: "2024-02-15",
      time: "11:00 AM",
      location: "Conference Hall",
      description: "Get expert advice on career choices, resume building, and job interview preparation."
    }
  ];

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>📅 Upcoming Events</h1>
        <p>Join our exciting events and be part of the youth movement</p>
      </div>
      
      <div className="events-grid">
        {upcomingEvents.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <h3>{event.title}</h3>
              <span className="event-date">{event.date}</span>
            </div>
            <div className="event-details">
              <p className="event-time">⏰ {event.time}</p>
              <p className="event-location">📍 {event.location}</p>
              <p className="event-description">{event.description}</p>
            </div>
            <div className="event-actions">
              <button className="cta-button register-btn">
                Register Now
              </button>
              <button className="secondary-button">
                Add to Calendar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Events Stats */}
      <div className="events-stats">
        <div className="stat-item">
          <div className="stat-number">50+</div>
          <div className="stat-label">Events Hosted</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">5,000+</div>
          <div className="stat-label">Participants</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">21+</div>
          <div className="stat-label">Cities</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">98%</div>
          <div className="stat-label">Satisfaction Rate</div>
        </div>
      </div>
    </div>
  );
};

export default Events;