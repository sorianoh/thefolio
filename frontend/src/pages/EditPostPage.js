// pages/EditPostPage.js
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EditPostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        // Check if user is author or admin
        if (user._id !== data.author?._id && user.role !== 'admin') {
          navigate('/home');
          return;
        }
        setTitle(data.title);
        setBody(data.body);
        setExistingImage(data.image || '');
        setLoading(false);
      } catch (err) {
        setError('Post not found');
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    if (image) fd.append('image', image);
    
    try {
      await API.put(`/posts/${id}`, fd);
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    }
  };

  if (loading) return (
    <div className="app-container">
      <Navbar />
      <main className="main-content"><p>Loading...</p></main>
      <Footer />
    </div>
  );

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="edit-post-page">
          <h2>Edit Post</h2>
          {error && <p className="error-msg">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Post title" 
              required 
            />
            <textarea 
              value={body} 
              onChange={e => setBody(e.target.value)} 
              placeholder="Write your post here..." 
              rows={12} 
              required 
            />
            {existingImage && !image && (
              <div className="current-image">
                <p>Current image:</p>
                <img 
                  src={`http://localhost:5000/uploads/${existingImage}`} 
                  alt="Current" 
                  style={{ width: '100px', borderRadius: '5px' }}
                />
              </div>
            )}
            <div>
              <label>Change Image (optional):</label>
              <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">Update Post</button>
              <button type="button" onClick={() => navigate(`/posts/${id}`)} className="cancel-btn">Cancel</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditPostPage;