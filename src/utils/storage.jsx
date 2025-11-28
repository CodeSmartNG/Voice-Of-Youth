// utils/storage.js - LocalStorage-based data management

// User Management
export const userStorage = {
  // Get all users
  getUsers: () => {
    try {
      return JSON.parse(localStorage.getItem('voyUsers') || '[]');
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  },

  // Save all users
  saveUsers: (users) => {
    try {
      localStorage.setItem('voyUsers', JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error saving users:', error);
      return false;
    }
  },

  // Create new user
  createUser: (userData) => {
    const users = userStorage.getUsers();
    const existingUser = users.find(u => u.email === userData.email);
    
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const newUser = {
      ...userData,
      uid: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    userStorage.saveUsers(users);
    return newUser;
  },

  // Find user by email
  findUserByEmail: (email) => {
    const users = userStorage.getUsers();
    return users.find(u => u.email === email);
  },

  // Find user by ID
  findUserById: (uid) => {
    const users = userStorage.getUsers();
    return users.find(u => u.uid === uid);
  },

  // Update user
  updateUser: (uid, updates) => {
    const users = userStorage.getUsers();
    const userIndex = users.findIndex(u => u.uid === uid);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    userStorage.saveUsers(users);
    return users[userIndex];
  },

  // Delete user
  deleteUser: (uid) => {
    const users = userStorage.getUsers();
    const filteredUsers = users.filter(u => u.uid !== uid);
    return userStorage.saveUsers(filteredUsers);
  }
};

// Posts Management
export const postStorage = {
  // Get all posts
  getPosts: () => {
    try {
      return JSON.parse(localStorage.getItem('voyPosts') || '[]');
    } catch (error) {
      console.error('Error getting posts:', error);
      return [];
    }
  },

  // Save all posts
  savePosts: (posts) => {
    try {
      localStorage.setItem('voyPosts', JSON.stringify(posts));
      return true;
    } catch (error) {
      console.error('Error saving posts:', error);
      return false;
    }
  },

  // Create new post
  createPost: (postData) => {
    const posts = postStorage.getPosts();
    const newPost = {
      ...postData,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      shares: 0,
      comments: []
    };

    posts.unshift(newPost); // Add to beginning for newest first
    postStorage.savePosts(posts);
    return newPost;
  },

  // Get post by ID
  getPostById: (id) => {
    const posts = postStorage.getPosts();
    return posts.find(p => p.id === id);
  },

  // Update post
  updatePost: (id, updates) => {
    const posts = postStorage.getPosts();
    const postIndex = posts.findIndex(p => p.id === id);
    
    if (postIndex === -1) {
      throw new Error('Post not found');
    }

    posts[postIndex] = {
      ...posts[postIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    postStorage.savePosts(posts);
    return posts[postIndex];
  },

  // Delete post
  deletePost: (id) => {
    const posts = postStorage.getPosts();
    const filteredPosts = posts.filter(p => p.id !== id);
    const success = postStorage.savePosts(filteredPosts);
    return { success, deletedCount: posts.length - filteredPosts.length };
  },

  // Like a post
  likePost: (id) => {
    const post = postStorage.getPostById(id);
    if (!post) throw new Error('Post not found');
    
    return postStorage.updatePost(id, {
      likes: (post.likes || 0) + 1
    });
  },

  // Add comment to post
  addComment: (postId, commentData) => {
    const post = postStorage.getPostById(postId);
    if (!post) throw new Error('Post not found');

    const newComment = {
      id: `comment-${Date.now()}`,
      ...commentData,
      createdAt: new Date().toISOString()
    };

    const updatedComments = [...(post.comments || []), newComment];
    return postStorage.updatePost(postId, { comments: updatedComments });
  }
};

// Session Management
export const sessionStorage = {
  // Get current user session
  getCurrentUser: () => {
    try {
      return JSON.parse(localStorage.getItem('voyCurrentUser') || 'null');
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Set current user session
  setCurrentUser: (user) => {
    try {
      if (user) {
        localStorage.setItem('voyCurrentUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('voyCurrentUser');
      }
      return true;
    } catch (error) {
      console.error('Error setting current user:', error);
      return false;
    }
  },

  // Clear current session
  clearSession: () => {
    try {
      localStorage.removeItem('voyCurrentUser');
      return true;
    } catch (error) {
      console.error('Error clearing session:', error);
      return false;
    }
  },

  // Get remember me preference
  getRememberMe: () => {
    return localStorage.getItem('rememberMe') === 'true';
  },

  // Set remember me preference
  setRememberMe: (remember) => {
    if (remember) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberMe');
    }
  }
};

// Events Management
export const eventStorage = {
  // Get all events
  getEvents: () => {
    try {
      const events = JSON.parse(localStorage.getItem('voyEvents') || '[]');
      // If no events in storage, initialize with sample events
      if (events.length === 0) {
        const sampleEvents = [
          {
            id: 'event-1',
            title: 'Youth Leadership Summit',
            date: '2024-01-15',
            time: '10:00 AM',
            location: 'Virtual',
            description: 'Join us for a day of inspiring talks and workshops about leadership and community engagement.',
            image: null,
            maxAttendees: 100,
            currentAttendees: 45,
            category: 'Workshop',
            status: 'upcoming'
          },
          {
            id: 'event-2',
            title: 'Community Service Day',
            date: '2024-01-20',
            time: '9:00 AM',
            location: 'Central Park',
            description: 'Make a difference in your community through various service activities and clean-up projects.',
            image: null,
            maxAttendees: 50,
            currentAttendees: 32,
            category: 'Volunteering',
            status: 'upcoming'
          }
        ];
        eventStorage.saveEvents(sampleEvents);
        return sampleEvents;
      }
      return events;
    } catch (error) {
      console.error('Error getting events:', error);
      return [];
    }
  },

  // Save all events
  saveEvents: (events) => {
    try {
      localStorage.setItem('voyEvents', JSON.stringify(events));
      return true;
    } catch (error) {
      console.error('Error saving events:', error);
      return false;
    }
  },

  // Create new event
  createEvent: (eventData) => {
    const events = eventStorage.getEvents();
    const newEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
      createdAt: new Date().toISOString(),
      currentAttendees: 0,
      status: 'upcoming'
    };

    events.push(newEvent);
    eventStorage.saveEvents(events);
    return newEvent;
  },

  // Register for event
  registerForEvent: (eventId, userId) => {
    const events = eventStorage.getEvents();
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }

    const event = events[eventIndex];
    
    // Check if event is full
    if (event.currentAttendees >= event.maxAttendees) {
      throw new Error('Event is full');
    }

    // Update attendees count
    events[eventIndex] = {
      ...event,
      currentAttendees: event.currentAttendees + 1
    };

    eventStorage.saveEvents(events);
    
    // Also store user's event registrations
    const userEvents = JSON.parse(localStorage.getItem(`userEvents_${userId}`) || '[]');
    userEvents.push({
      eventId,
      registeredAt: new Date().toISOString()
    });
    localStorage.setItem(`userEvents_${userId}`, JSON.stringify(userEvents));

    return events[eventIndex];
  }
};

// Analytics/Stats
export const analyticsStorage = {
  // Get site statistics
  getStats: () => {
    try {
      const stats = JSON.parse(localStorage.getItem('voyStats') || '{}');
      
      // Initialize with default stats if empty
      if (Object.keys(stats).length === 0) {
        const defaultStats = {
          totalUsers: 0,
          totalPosts: 0,
          totalEvents: 0,
          totalRegistrations: 0,
          lastUpdated: new Date().toISOString()
        };
        analyticsStorage.saveStats(defaultStats);
        return defaultStats;
      }
      
      return stats;
    } catch (error) {
      console.error('Error getting stats:', error);
      return {};
    }
  },

  // Save statistics
  saveStats: (stats) => {
    try {
      localStorage.setItem('voyStats', JSON.stringify({
        ...stats,
        lastUpdated: new Date().toISOString()
      }));
      return true;
    } catch (error) {
      console.error('Error saving stats:', error);
      return false;
    }
  },

  // Update stats when new content is added
  incrementStat: (statName, increment = 1) => {
    const stats = analyticsStorage.getStats();
    const updatedStats = {
      ...stats,
      [statName]: (stats[statName] || 0) + increment
    };
    analyticsStorage.saveStats(updatedStats);
    return updatedStats;
  }
};

// Utility Functions
export const storageUtils = {
  // Clear all app data
  clearAllData: () => {
    const keys = [
      'voyUsers',
      'voyPosts',
      'voyEvents',
      'voyStats',
      'voyCurrentUser',
      'rememberMe'
    ];

    keys.forEach(key => {
      localStorage.removeItem(key);
    });

    // Also clear user-specific event registrations
    Object.keys(localStorage)
      .filter(key => key.startsWith('userEvents_'))
      .forEach(key => localStorage.removeItem(key));

    return true;
  },

  // Export all data (for backup)
  exportData: () => {
    const data = {
      users: userStorage.getUsers(),
      posts: postStorage.getPosts(),
      events: eventStorage.getEvents(),
      stats: analyticsStorage.getStats(),
      exportedAt: new Date().toISOString()
    };
    return data;
  },

  // Import data
  importData: (data) => {
    try {
      if (data.users) userStorage.saveUsers(data.users);
      if (data.posts) postStorage.savePosts(data.posts);
      if (data.events) eventStorage.saveEvents(data.events);
      if (data.stats) analyticsStorage.saveStats(data.stats);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },

  // Get storage usage info
  getStorageInfo: () => {
    let totalSize = 0;
    const items = {};

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const value = localStorage.getItem(key);
        const size = new Blob([value]).size;
        items[key] = {
          size: size,
          value: value.length > 100 ? value.substring(0, 100) + '...' : value
        };
        totalSize += size;
      }
    }

    return {
      totalSize,
      itemCount: Object.keys(items).length,
      items
    };
  }
};

export default {
  userStorage,
  postStorage,
  sessionStorage,
  eventStorage,
  analyticsStorage,
  storageUtils
};