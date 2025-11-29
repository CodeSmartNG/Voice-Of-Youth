import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = ({ isAdmin, user }) => {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    media: null,
    mediaType: 'image'
  });
  const [loading, setLoading] = useState(false);

  // Load posts from localStorage on component mount
  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('voyPosts') || '[]');
    setPosts(savedPosts);
  }, []);

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    localStorage.setItem('voyPosts', JSON.stringify(posts));
  }, [posts]);

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
      if (editingPost) {
        // Update existing post
        const updatedPosts = posts.map(post => 
          post.id === editingPost.id 
            ? { 
                ...post, 
                title: formData.title,
                description: formData.description,
                media: formData.media || post.media,
                mediaType: formData.media ? formData.mediaType : post.mediaType,
                updatedAt: new Date().toISOString()
              }
            : post
        );
        setPosts(updatedPosts);
        alert('Post updated successfully!');
      } else {
        // Create new post
        const newPost = {
          id: Date.now().toString(),
          title: formData.title,
          description: formData.description,
          media: formData.media,
          mediaType: formData.mediaType,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: user?.displayName || 'Admin',
          likes: 0,
          shares: 0
        };

        const updatedPosts = [newPost, ...posts];
        setPosts(updatedPosts);
        alert('Post created successfully!');
      }

      // Reset form
      resetForm();

    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      media: null,
      mediaType: 'image'
    });
    setEditingPost(null);
    setShowForm(false);
  };

  const editPost = (post) => {
    setFormData({
      title: post.title,
      description: post.description,
      media: post.media,
      mediaType: post.mediaType
    });
    setEditingPost(post);
    setShowForm(true);
  };

  const deletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);
      alert('Post deleted successfully!');
    }
  };

  const clearMedia = () => {
    setFormData(prev => ({
      ...prev,
      media: null,
      mediaType: 'image'
    }));
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
            <div className="stat-number">{posts.length}</div>
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
            <div className="stat-number">
              {posts.filter(post => post.updatedAt !== post.createdAt).length}
            </div>
            <div className="stat-label">Updated Posts</div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="action-bar">
          <button 
            className="create-post-btn"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            📝 Create New Post
          </button>
        </div>

        {/* Create/Edit Post Form */}
        {showForm && (
          <div className="post-form-overlay">
            <div className="post-form">
              <div className="form-header">
                <h2 className={editingPost ? 'editing' : ''}>
                  {editingPost ? 'Edit Post' : 'Create New Post'}
                </h2>
                <button 
                  className="close-btn"
                  onClick={resetForm}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Post Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter post title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter post description"
                    rows="4"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Media Upload</label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaChange}
                  />
                  <small>Supported formats: Images (JPG, PNG) and Videos (MP4, MOV)</small>

                  {formData.media && (
                    <div className="media-actions">
                      <button 
                        type="button" 
                        className="clear-media-btn"
                        onClick={clearMedia}
                      >
                        🗑️ Remove Media
                      </button>
                    </div>
                  )}
                </div>

                {formData.media && (
                  <div className="media-preview">
                    <label>Preview:</label>
                    {formData.mediaType === 'image' ? (
                      <img src={formData.media} alt="Preview" />
                    ) : (
                      <video controls>
                        <source src={formData.media} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      editingPost ? 'Updating...' : 'Publishing...'
                    ) : (
                      editingPost ? 'Update Post' : 'Publish Post'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div className="posts-list">
          <h3>Your Posts ({posts.length})</h3>

          {posts.length === 0 ? (
            <div className="no-posts">
              <p>No posts yet. Create your first post!</p>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map(post => (
                <div key={post.id} className="post-card">
                  {post.media && (
                    <div className="post-media">
                      {post.mediaType === 'image' ? (
                        <img src={post.media} alt={post.title} />
                      ) : (
                        <video controls>
                          <source src={post.media} type="video/mp4" />
                        </video>
                      )}
                    </div>
                  )}

                  <div className="post-content">
                    <h4>{post.title}</h4>
                    <p>{post.description}</p>
                    <div className="post-meta">
                      <span>By {post.author}</span>
                      <span>•</span>
                      <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                      {post.updatedAt !== post.createdAt && (
                        <>
                          <span>•</span>
                          <span>Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                    <div className="post-stats">
                      <span>❤️ {post.likes} likes</span>
                      <span>🔗 {post.shares} shares</span>
                    </div>
                  </div>

                  <div className="post-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => editPost(post)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => deletePost(post.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;