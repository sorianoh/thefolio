import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PostDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userReaction, setUserReaction] = useState(null);
  const [localReactions, setLocalReactions] = useState({
    like: 0, heart: 0, haha: 0, sad: 0, angry: 0
  });

  const reactionEmojis = {
    like: '👍',
    heart: '❤️',
    haha: '😂',
    sad: '😢',
    angry: '😠'
  };

  const reactionNames = {
    like: 'Like',
    heart: 'Heart',
    haha: 'Haha',
    sad: 'Sad',
    angry: 'Angry'
  };

  // Helper function para kumuha ng image URL (gumagana sa local at production)
  const getImageUrl = (filename) => {
    if (!filename) return null;
    const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${baseUrl}/uploads/${filename}`;
  };

  const fetchPostAndComments = useCallback(async () => {
    try {
      const [postRes, commentsRes] = await Promise.all([
        API.get(`/posts/${id}`),
        API.get(`/comments/${id}`)
      ]);
      setPost(postRes.data);
      setLocalReactions(postRes.data.reactions || { like: 0, heart: 0, haha: 0, sad: 0, angry: 0 });
      setComments(commentsRes.data);
    } catch (err) {
      setError('Post not found or has been removed');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPostAndComments();
  }, [fetchPostAndComments]);

  useEffect(() => {
    const fetchUserReaction = async () => {
      if (user) {
        try {
          const { data } = await API.get(`/reactions/${id}/user`);
          setUserReaction(data.userReaction);
        } catch (err) {
          console.error('Failed to fetch user reaction:', err);
        }
      }
    };
    fetchUserReaction();
  }, [id, user]);

  const handleReaction = async (type) => {
    if (!user) {
      alert('Please login to react to posts');
      return;
    }

    try {
      const { data } = await API.post(`/reactions/${id}`, { type });
      setLocalReactions(data.reactions);
      setUserReaction(data.userReaction);
      setPost(prev => ({ ...prev, reactions: data.reactions }));
    } catch (err) {
      console.error('Failed to add reaction:', err);
      alert('Failed to add reaction');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    try {
      const { data } = await API.post(`/comments/${id}`, { body: commentBody });
      setComments([...comments, data]);
      setCommentBody('');
    } catch (err) {
      alert('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await API.delete(`/posts/${id}`);
        navigate('/home');
      } catch (err) {
        alert('Failed to delete post');
      }
    }
  };

  const handleEditPost = () => {
    navigate(`/edit-post/${id}`);
  };

  if (loading) return (
    <div className="app-container">
      <Header />
      <main className="main-content"><p>Loading post...</p></main>
      <Footer />
    </div>
  );

  if (error || !post) return (
    <div className="app-container">
      <Header />
      <main className="main-content"><p>{error || 'Post not found'}</p></main>
      <Footer />
    </div>
  );

  const canEditDelete = user && (user._id === post.author?._id || user.role === 'admin');
  const canComment = user && (user.role === 'member' || user.role === 'admin');
  const totalReactions = Object.values(localReactions).reduce((a, b) => a + b, 0);

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <article className="post-detail" style={{ maxWidth: '800px', margin: '40px auto', background: 'pink', padding: '30px', borderRadius: '15px' }}>
          <h1>{post.title}</h1>
          <p className="post-meta">By {post.author?.name} | {new Date(post.createdAt).toLocaleDateString()}</p>
          
          {/* UPDATED: Image URL gamit ang helper function */}
          {post.image && (
            <img 
              src={getImageUrl(post.image)} 
              alt={post.title} 
              style={{ 
                width: '100%', 
                maxHeight: '400px', 
                objectFit: 'cover',
                borderRadius: '10px', 
                margin: '20px 0' 
              }} 
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          
          <div className="post-body">
            <p style={{ textAlign: 'justify' }}>{post.body}</p>
          </div>

          {/* Reaction Buttons */}
          <div className="post-reactions">
            {Object.entries(reactionEmojis).map(([type, emoji]) => (
              <button
                key={type}
                onClick={() => handleReaction(type)}
                className={`reaction-btn ${userReaction === type ? 'active' : ''}`}
              >
                <span>{emoji}</span>
                <span className="reaction-count">{localReactions[type] || 0}</span>
              </button>
            ))}
          </div>

          {/* Reaction Summary */}
          {totalReactions > 0 && (
            <div className="reaction-summary">
              {Object.entries(localReactions)
                .filter(([_, count]) => count > 0)
                .map(([type, count]) => (
                  <div key={type} className="reaction-badge">
                    <span>{reactionEmojis[type]}</span>
                    <span>{reactionNames[type]}</span>
                    <span>{count}</span>
                  </div>
                ))}
            </div>
          )}

          {canEditDelete && (
            <div className="post-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={handleEditPost} style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
                Edit Post
              </button>
              <button onClick={handleDeletePost} style={{ background: '#ff8da1', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
                Delete Post
              </button>
            </div>
          )}

          <section className="comments-section" style={{ marginTop: '40px' }}>
            <h3>Comments ({comments.length})</h3>
            
            {canComment ? (
              <form onSubmit={handleAddComment} style={{ marginBottom: '20px' }}>
                <textarea
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  placeholder="Write a comment..."
                  rows={3}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <button type="submit" className="submit-btn" style={{ marginTop: '10px' }}>Post Comment</button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', background: '#ffe4e1', borderRadius: '10px' }}>
                <p>💬 <Link to="/login">Login</Link> as a member to leave a comment.</p>
                {!user && <p style={{ fontSize: '12px', marginTop: '5px' }}>Only registered members can comment on posts.</p>}
              </div>
            )}

            <div className="comments-list">
              {comments.map(comment => (
                <div key={comment._id} style={{ background: '#ffe4e1', padding: '15px', borderRadius: '10px', marginBottom: '10px' }}>
                  <strong>{comment.author?.name}</strong>
                  <p style={{ marginTop: '5px' }}>{comment.body}</p>
                  {(user?._id === comment.author?._id || user?.role === 'admin') && (
                    <button onClick={() => handleDeleteComment(comment._id)} style={{ background: '#ff8da1', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default PostDetailPage;