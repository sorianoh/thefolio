import { useState, useEffect } from 'react';
import API from '../api/axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const AdminPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [tab, setTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [usersRes, postsRes, messagesRes, unreadRes] = await Promise.all([
        API.get('/admin/users'),
        API.get('/admin/posts'),
        API.get('/messages'),
        API.get('/messages/unread/count')
      ]);
      setUsers(usersRes.data);
      setPosts(postsRes.data);
      setMessages(messagesRes.data);
      setUnreadCount(unreadRes.data.count);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const { data } = await API.put(`/admin/users/${id}/status`);
      setUsers(users.map(u => u._id === id ? data.user : u));
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const removePost = async (id) => {
    try {
      await API.put(`/admin/posts/${id}/remove`);
      setPosts(posts.map(p => p._id === id ? { ...p, status: 'removed' } : p));
    } catch (err) {
      alert('Failed to remove post');
    }
  };

  const markMessageAsRead = async (id) => {
    try {
      await API.put(`/messages/${id}/read`);
      setMessages(messages.map(m => m._id === id ? { ...m, status: 'read' } : m));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      alert('Failed to mark message as read');
    }
  };

  const deleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await API.delete(`/messages/${id}`);
        const deletedMessage = messages.find(m => m._id === id);
        setMessages(messages.filter(m => m._id !== id));
        if (deletedMessage?.status === 'unread') {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      } catch (err) {
        alert('Failed to delete message');
      }
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Header />
        <main className="main-content">
          <div className="loading-spinner">Loading admin dashboard...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="admin-page">
          {/* WELCOME BACK SECTION - Pink background, Pink font, Centered text */}
          <div style={{ 
            backgroundColor: 'pink',
            padding: '30px',
            borderRadius: '20px',
            marginBottom: '30px',
            textAlign: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#d81b60' }}>
              {getGreeting()}, Welcome back!
            </h1>
            <h2 style={{ margin: '10px 0 0 0', fontSize: '24px', fontWeight: 'normal', color: '#d81b60' }}>
              👋 {user?.name || 'Admin'}!
            </h2>
            <p style={{ margin: '10px 0 0 0', opacity: 0.9, color: '#d81b60' }}>
              Here's what's happening with your coffee community today.
            </p>
          </div>
          
          <div className="admin-stats">
            <div className="stat-card">
              <h3>{users.length}</h3>
              <p>Total Members</p>
            </div>
            <div className="stat-card">
              <h3>{posts.length}</h3>
              <p>Total Posts</p>
            </div>
            <div className="stat-card">
              <h3>{messages.length}</h3>
              <p>Total Messages</p>
              {unreadCount > 0 && (
                <span className="unread-badge">{unreadCount} unread</span>
              )}
            </div>
          </div>

          <div className="admin-tabs">
            <button 
              onClick={() => setTab('users')} 
              className={tab === 'users' ? 'active' : ''}
            >
              👥 Members ({users.length})
            </button>
            <button 
              onClick={() => setTab('posts')} 
              className={tab === 'posts' ? 'active' : ''}
            >
              📝 All Posts ({posts.length})
            </button>
            <button 
              onClick={() => setTab('messages')} 
              className={tab === 'messages' ? 'active' : ''}
            >
              ✉️ Messages ({messages.length})
              {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>
          </div>

          {/* Users Tab */}
          {tab === 'users' && (
            <div className="admin-table-container">
              <h3>Member Management</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`status-badge ${u.status}`}>
                          {u.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button 
                          onClick={() => toggleStatus(u._id)} 
                          className={u.status === 'active' ? 'btn-warning' : 'btn-success'}
                        >
                          {u.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Posts Tab */}
          {tab === 'posts' && (
            <div className="admin-table-container">
              <h3>Post Management</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(p => (
                    <tr key={p._id}>
                      <td>{p.title}</td>
                      <td>{p.author?.name}</td>
                      <td>
                        <span className={`status-badge ${p.status}`}>
                          {p.status === 'published' ? '📄 Published' : '🗑️ Removed'}
                        </span>
                      </td>
                      <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td>
                        {p.status === 'published' && (
                          <button className="btn-danger" onClick={() => removePost(p._id)}>
                            Remove
                          </button>
                        )}
                        {p.status === 'removed' && (
                          <span className="removed-text">Removed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Messages Tab */}
          {tab === 'messages' && (
            <div className="admin-table-container">
              <h3>Contact Messages</h3>
              {messages.length === 0 ? (
                <p className="no-data">No messages yet.</p>
              ) : (
                <div className="messages-list">
                  {messages.map(m => (
                    <div key={m._id} className={`message-card ${m.status}`}>
                      <div className="message-header">
                        <div>
                          <strong>{m.name}</strong>
                          <span className="message-email">({m.email})</span>
                          {m.status === 'unread' && <span className="unread-tag">Unread</span>}
                        </div>
                        <div className="message-date">
                          {new Date(m.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="message-body">
                        <p>{m.message}</p>
                      </div>
                      <div className="message-actions">
                        {m.status === 'unread' && (
                          <button 
                            onClick={() => markMessageAsRead(m._id)}
                            className="btn-info"
                          >
                            Mark as Read
                          </button>
                        )}
                        <button 
                          onClick={() => deleteMessage(m._id)}
                          className="btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;