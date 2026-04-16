import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    if (image) {
      formData.append('image', image);
    }
    
    try {
      await API.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish post');
      setLoading(false);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="create-post-page">
          <h2>Write a New Post</h2>
          
          {isAdmin && (
            <div style={{ 
              background: '#ffe4e1', 
              padding: '12px', 
              borderRadius: '10px', 
              marginBottom: '20px',
              borderLeft: '4px solid #d81b60'
            }}>
              <p style={{ margin: 0, color: '#d81b60' }}>
                ✨ You're posting as an admin. Your post will be featured! ✨
              </p>
            </div>
          )}
          
          {error && <p className="error-msg">{error}</p>}
          
          <form onSubmit={handleSubmit}>
            <input 
              type="text"
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Post title" 
              required 
              disabled={loading}
            />
            
            <textarea 
              value={body} 
              onChange={e => setBody(e.target.value)} 
              placeholder="Write your post here..." 
              rows={12} 
              required 
              disabled={loading}
            />
            
            <div className="image-upload-section">
              <label>Upload Image (Optional):</label>
              <input 
                type="file" 
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" 
                onChange={handleImageChange} 
                disabled={loading}
              />
              
              {imagePreview && (
                <div className="image-preview">
                  <p>Preview:</p>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '300px', 
                      maxHeight: '200px', 
                      borderRadius: '10px',
                      marginTop: '10px'
                    }} 
                  />
                </div>
              )}
              
              <small style={{ fontSize: '12px', color: '#888', marginTop: '5px', display: 'block' }}>
                Accepted formats: JPG, PNG, GIF, WEBP (Max 5MB)
              </small>
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreatePostPage;