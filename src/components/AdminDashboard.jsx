import React, { useState, useEffect } from 'react';
import { postStorage, analyticsStorage } from '../utils/storage';
import './AdminDashboard.css';

const AdminDashboard = ({ isAdmin, user }) => {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    media: null,
    mediaType: 'image'
  });
  const [loading, setLoading] = useState(false);

  // Load posts from storage
  useEffect(() => {
    const savedPosts = postStorage.getPosts();
    setPosts(savedPosts);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          media: e.target.result,
          mediaType: file.type.startsWith('video') ? 'video' : 'image'
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const newPost = postStorage.createPost({
        title: formData.title,
        description: formData.description,
        media: formData.media,
        mediaType: formData.mediaType,
        author: user?.displayName || 'Admin',
        authorId: user?.uid
      });

      setPosts([newPost, ...posts]);
      
      // Update stats
      analyticsStorage.incrementStat('totalPosts');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        media: null,
        mediaType: 'image'
      });
      setShowForm(false);
      
      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const result = postStorage.deletePost(postId);
      if (result.success) {
        const updatedPosts = posts.filter(post => post.id !== postId);
        setPosts(updatedPosts);
        alert('Post deleted successfully!');
      }
    }
  };

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="admin-dashboard">
        <div className="access-denied">
          <h2>🔒 Access Denied</h2>
          <p>You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  const stats = analyticsStorage.getStats();

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage content and posts for Voice of Youth</p>
      </div>

      <div className="admin-content">
        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-number">{stats.totalPosts || 0}</div>
            <div className="stat-label">Total Posts</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {posts.filter(post => post.mediaType === 'image').length}
            </div>
            <div className="stat-label">Image Posts</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {posts.filter(post => post.mediaType === 'video').length}
            </div>
            <div className="stat-label">Video Posts</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalUsers || 0}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>

        {/* Rest of your AdminDashboard component remains the same */}
        {/* ... */}
      </div>
    </div>
  );
};

export default AdminDashboard;