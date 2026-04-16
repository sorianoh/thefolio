import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMsg(location.state.message);
      // Clear the message after 3 seconds
      setTimeout(() => {
        setSuccessMsg('');
      }, 3000);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const user = await login(email, password);
      
      // Show success notification
      setSuccessMsg('Login successful! Welcome back!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMsg('');
      }, 3000);
      
      // Redirect based on role after a short delay
      setTimeout(() => {
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      }, 500);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="content-box" style={{ maxWidth: '400px', margin: '40px auto' }}>
          <h2>Login to Coffee Center</h2>
          
          {successMsg && (
            <div className="alert alert-success" style={{ 
              background: '#d4edda', 
              color: '#155724', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              border: '1px solid #c3e6cb'
            }}>
              {successMsg}
            </div>
          )}
          
          {error && (
            <div className="alert alert-error" style={{ 
              background: '#f8d7da', 
              color: '#721c24', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              border: '1px solid #f5c6cb'
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="contact-form">
            <input 
              type="email" 
              placeholder="Email address" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              disabled={loading}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              disabled={loading}
            />
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
          
          <div style={{ marginTop: '20px', fontSize: '12px', color: '#888', padding: '10px', background: '#f5f5f5', borderRadius: '8px' }}>
            <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Demo Accounts:</p>
            <p>📧 Admin: admin@thefolio.com | 🔑 Admin@1234</p>
            <p>📧 Member: (register a new account)</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;