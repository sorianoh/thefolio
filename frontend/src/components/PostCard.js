import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const PostCard = ({ post, onDelete, onReactionUpdate }) => {
  const { user } = useAuth();
  const [userReaction, setUserReaction] = useState(null);
  const [localReactions, setLocalReactions] = useState(post.reactions || {
    like: 0, heart: 0, haha: 0, sad: 0, angry: 0
  });
  const [imageError, setImageError] = useState(false);

  const reactionEmojis = {
    like: '👍',
    heart: '❤️',
    haha: '😂',
    sad: '😢',
    angry: '😠'
  };

  useEffect(() => {
    const fetchUserReaction = async () => {
      if (user && post?._id) {
        try {
          const { data } = await API.get(`/reactions/${post._id}/user`);
          setUserReaction(data.userReaction);
        } catch (err) {
          console.error('Failed to fetch user reaction:', err);
        }
      }
    };
    fetchUserReaction();
  }, [post?._id, user]);

  const handleReaction = async (type) => {
    if (!user) {
      alert('Please login to react to posts');
      return;
    }

    try {
      const { data } = await API.post(`/reactions/${post._id}`, { type });
      setLocalReactions(data.reactions);
      setUserReaction(data.userReaction);
      if (onReactionUpdate) {
        onReactionUpdate(post._id, data.reactions);
      }
    } catch (err) {
      console.error('Failed to add reaction:', err);
      alert('Failed to add reaction');
    }
  };

  const canDelete = user && (user._id === post.author?._id || user.role === 'admin');
  
  const postTitle = post?.title || 'Untitled';
  const postAuthor = post?.author?.name || 'Unknown Author';
  const postDate = post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date';
  const postBody = post?.body || '';
  const postExcerpt = postBody.length > 150 ? postBody.substring(0, 150) + '...' : postBody;
  
  // Image URL - lahat ng users (admin, member, guest) makakakita
  const imageUrl = post?.image && !imageError
    ? `http://localhost:5000/uploads/${post.image}`
    : null;

  return (
    <div className="post-card">
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={postTitle} 
          className="post-card-image"
          onError={() => setImageError(true)}
        />
      )}
      <div className="post-card-content">
        <h3>{postTitle}</h3>
        <p className="post-meta">By {postAuthor} | {postDate}</p>
        <p className="post-excerpt">{postExcerpt}</p>
        
        {/* Reactions - visible sa lahat pero need maglogin para mag-reaction */}
        <div className="post-card-reactions">
          {Object.entries(reactionEmojis).map(([type, emoji]) => (
            <button
              key={type}
              onClick={() => handleReaction(type)}
              className={`reaction-mini-btn ${userReaction === type ? 'active' : ''}`}
              title={!user ? 'Login to react' : ''}
            >
              <span>{emoji}</span>
              <span className="reaction-mini-count">{localReactions[type] || 0}</span>
            </button>
          ))}
        </div>

        <div className="post-card-actions">
          <Link to={`/posts/${post._id}`} className="read-more-btn">Read More →</Link>
          {canDelete && (
            <button onClick={() => onDelete(post._id)} className="delete-btn-small">
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;