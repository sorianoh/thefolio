// pages/PostPage.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';

const PostPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await API.get('/posts');
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await API.delete(`/posts/${postId}`);
        setPosts(posts.filter(post => post._id !== postId));
      } catch (err) {
        alert('Failed to delete post');
      }
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="posts-page">
          <div className="posts-header">
            <h1>All Posts</h1>
            {user && (
              <button onClick={() => navigate('/create-post')} className="create-post-btn">
                + Create New Post
              </button>
            )}
          </div>

          {loading ? (
            <div className="loading-spinner">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="no-posts">
              <p>No posts yet. Be the first to create one!</p>
              {user && (
                <button onClick={() => navigate('/create-post')} className="submit-btn">
                  Create Your First Post
                </button>
              )}
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map(post => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostPage;