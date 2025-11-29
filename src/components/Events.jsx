import React, { useState, useEffect } from 'react';
import { eventsStorage, analyticsStorage } from '../utils/storage';
import LoadingSpinner from './LoadingSpinner';
import Notification from './Notification';
import './Events.css';

const Events = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const allEvents = eventsStorage.getAllEvents();
      setEvents(allEvents);
      
      // Track event page view
      analyticsStorage.incrementStat('eventPageViews');
      
    } catch (err) {
      setError('Failed to load events');
      showNotification('Error loading events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  const handleJoinEvent = (eventId) => {
    try {
      const event = events.find(e => e.id === eventId);
      if (!event) return;

      // Check if user already joined
      if (event.participants?.includes(user.userId)) {
        showNotification('You have already joined this event', 'warning');
        return;
      }

      // Add user to event participants
      eventsStorage.addParticipant(eventId, user.userId);
      
      // Update local state
      setEvents(events.map(e => 
        e.id === eventId 
          ? { ...e, participants: [...(e.participants || []), user.userId] }
          : e
      ));

      // Update analytics
      analyticsStorage.incrementStat('eventRegistrations');
      
      showNotification(`Successfully joined ${event.title}`, 'success');
      
    } catch (err) {
      showNotification('Error joining event', 'error');
    }
  };

  const handleLeaveEvent = (eventId) => {
    try {
      const event = events.find(e => e.id === eventId);
      if (!event) return;

      // Remove user from event participants
      eventsStorage.removeParticipant(eventId, user.userId);
      
      // Update local state
      setEvents(events.map(e => 
        e.id === eventId 
          ? { ...e, participants: e.participants?.filter(id => id !== user.userId) || [] }
          : e
      ));

      showNotification(`Left ${event.title}`, 'info');
      
    } catch (err) {
      showNotification('Error leaving event', 'error');
    }
  };

  // Filter events based on selection and search
  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'upcoming' && new Date(event.date) > new Date()) ||
                         (filter === 'past' && new Date(event.date) <= new Date()) ||
                         (filter === 'joined' && event.participants?.includes(user.userId));
    
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isEventJoined = (event) => {
    return event.participants?.includes(user.userId);
  };

  const isEventFull = (event) => {
    return event.participants && event.participants.length >= event.capacity;
  };

  if (loading) {
    return <LoadingSpinner message="Loading events..." />;
  }

  if (error) {
    return (
      <div className="events-error">
        <div className="error-content">
          <h2>Unable to Load Events</h2>
          <p>{error}</p>
          <button onClick={loadEvents} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="events-container">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
          duration={3000}
        />
      )}

      {/* Events Header */}
      <div className="events-header">
        <div className="events-hero">
          <h1>Youth Events & Activities</h1>
          <p>Join our community events, workshops, and activities designed to empower young voices</p>
        </div>

        {/* Filters and Search */}
        <div className="events-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-buttons">
            {['all', 'upcoming', 'past', 'joined'].map(filterType => (
              <button
                key={filterType}
                className={`filter-btn ${filter === filterType ? 'active' : ''}`}
                onClick={() => setFilter(filterType)}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="events-grid">
        {filteredEvents.length === 0 ? (
          <div className="no-events">
            <div className="no-events-icon">📅</div>
            <h3>No events found</h3>
            <p>
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No events are scheduled at the moment. Check back later!'}
            </p>
          </div>
        ) : (
          filteredEvents.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <h3 className="event-title">{event.title}</h3>
                <span className={`event-status ${event.status}`}>
                  {event.status}
                </span>
              </div>

              <div className="event-date">
                <span className="date-icon">📅</span>
                {formatDate(event.date)}
              </div>

              <div className="event-location">
                <span className="location-icon">📍</span>
                {event.location}
              </div>

              <p className="event-description">{event.description}</p>

              <div className="event-details">
                <div className="event-capacity">
                  <span className="capacity-icon">👥</span>
                  {event.participants?.length || 0} / {event.capacity} participants
                </div>
                
                {event.category && (
                  <span className="event-category">
                    {event.category}
                  </span>
                )}
              </div>

              <div className="event-actions">
                {isEventJoined(event) ? (
                  <button
                    onClick={() => handleLeaveEvent(event.id)}
                    className="btn-secondary leave-btn"
                  >
                    Leave Event
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoinEvent(event.id)}
                    disabled={isEventFull(event)}
                    className={`btn-primary ${isEventFull(event) ? 'disabled' : ''}`}
                  >
                    {isEventFull(event) ? 'Event Full' : 'Join Event'}
                  </button>
                )}
              </div>

              {isEventFull(event) && !isEventJoined(event) && (
                <div className="event-full-message">
                  This event has reached maximum capacity
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;