import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success');
  const [loading, setLoading] = useState(false);

  // Get initial ng pangalan
  const getInitial = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  // Format member since
  const formatMemberSince = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get account type badge color
  const getAccountTypeColor = (type) => {
    switch(type) {
      case 'admin': return '#d81b60';
      case 'member': return '#4CAF50';
      default: return '#888';
    }
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    
    try {
      const { data } = await API.put('/auth/profile', { name, bio });
      setUser(data);
      setMsgType('success');
      setMsg('Profile updated successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsgType('error');
      setMsg(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePictureUpload = async (e) => {
    e.preventDefault();
    
    if (!profilePic) {
      setMsgType('error');
      setMsg('Please select a picture first');
      return;
    }
    
    setMsg('');
    setLoading(true);
    
    const formData = new FormData();
    formData.append('profilePic', profilePic);
    
    try {
      const { data } = await API.post('/auth/upload-profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setUser(data);
      setMsgType('success');
      setMsg('Profile picture updated successfully!');
      setProfilePic(null);
      setProfilePicPreview(null);
      
      const fileInput = document.getElementById('profilePicInput');
      if (fileInput) fileInput.value = '';
      
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsgType('error');
      setMsg(err.response?.data?.message || 'Error uploading picture');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const previewUrl = URL.createObjectURL(file);
      setProfilePicPreview(previewUrl);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    
    try {
      await API.put('/auth/change-password', { currentPassword: curPw, newPassword: newPw });
      setMsgType('success');
      setMsg('Password changed successfully!');
      setCurPw('');
      setNewPw('');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsgType('error');
      setMsg(err.response?.data?.message || 'Error changing password');
    } finally {
      setLoading(false);
    }
  };

  const hasProfilePic = user?.profilePic && user.profilePic !== '';
  const profilePicSrc = hasProfilePic ? `http://localhost:5000/uploads/${user.profilePic}` : null;

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="profile-page">
          <h2>My Profile</h2>
          
          {/* Profile Picture Circle */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            {hasProfilePic ? (
              <img 
                src={profilePicSrc} 
                alt="Profile" 
                style={{ 
                  width: '150px', 
                  height: '150px', 
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid #d81b60',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                }}
              />
            ) : (
              <div style={{ 
                width: '150px', 
                height: '150px', 
                borderRadius: '50%',
                backgroundColor: '#d81b60',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '4px solid #ff8da1',
                boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                margin: '0 auto'
              }}>
                <span style={{ fontSize: '60px', color: 'white', fontWeight: 'bold' }}>
                  {getInitial(user?.name)}
                </span>
              </div>
            )}
          </div>
          
          {/* Message Alert */}
          {msg && (
            <div className={`alert ${msgType === 'success' ? 'alert-success' : 'alert-error'}`}>
              {msg}
            </div>
          )}
          
          {/* Upload Profile Picture Form */}
          <form onSubmit={handlePictureUpload} style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h3>Update Profile Picture</h3>
            <input 
              id="profilePicInput"
              type="file" 
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" 
              onChange={handleFileSelect} 
              disabled={loading}
              style={{ marginBottom: '10px' }}
            />
            
            {profilePicPreview && (
              <div style={{ margin: '15px 0' }}>
                <p>Preview:</p>
                <img 
                  src={profilePicPreview} 
                  alt="Preview" 
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }} 
                />
              </div>
            )}
            
            <button type="submit" className="submit-btn" disabled={loading || !profilePic}>
              {loading ? 'Uploading...' : 'Upload Picture'}
            </button>
          </form>
          
          {/* Edit Profile Form */}
          <form onSubmit={handleProfile}>
            <h3>Edit Profile</h3>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Display name" 
              disabled={loading}
            />
            <textarea 
              value={bio} 
              onChange={e => setBio(e.target.value)} 
              placeholder="Short bio..." 
              rows={3} 
              disabled={loading}
            />
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
          
          {/* Change Password Form */}
          <form onSubmit={handlePassword}>
            <h3>Change Password</h3>
            <input 
              type="password" 
              placeholder="Current password" 
              value={curPw} 
              onChange={e => setCurPw(e.target.value)} 
              required 
              disabled={loading}
            />
            <input 
              type="password" 
              placeholder="New password (min 6 chars)" 
              value={newPw} 
              onChange={e => setNewPw(e.target.value)} 
              required 
              minLength={6}
              disabled={loading}
            />
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
          
          {/* Account Information Card - Nasa BABA na ng Change Password */}
          <div style={{ 
            background: '#f5f5f5', 
            padding: '20px', 
            borderRadius: '15px', 
            marginTop: '30px',
            textAlign: 'left'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#d81b60' }}>Account Information</h3>
            <p><strong>👤 Account Type:</strong> 
              <span style={{ 
                background: getAccountTypeColor(user?.accountType || user?.role),
                color: 'white',
                padding: '3px 10px',
                borderRadius: '20px',
                marginLeft: '10px',
                fontSize: '12px'
              }}>
                {user?.accountType || user?.role || 'Basic'}
              </span>
            </p>
            <p><strong>📅 Member Since:</strong> {formatMemberSince(user?.memberSince || user?.createdAt)}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;