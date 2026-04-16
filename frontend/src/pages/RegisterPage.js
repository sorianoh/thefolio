import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RegisterPage = () => {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    birthday: '',
    password: '', 
    confirmPassword: '',
    gender: '',
    accountType: 'basic'
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    
    // Validate password match
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    // Validate gender
    if (!form.gender) {
      setError('Please select your gender');
      setLoading(false);
      return;
    }
    
    try {
      const response = await API.post('/auth/register', form);
      console.log('Registration response:', response.data);
      
      setSuccessMsg('Registration successful! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Registration successful! Please login to continue.' } 
        });
      }, 2000);
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="content-box" style={{ maxWidth: '500px', margin: '40px auto' }}>
          <h2>Create an Account</h2>
          
          {successMsg && (
            <div className="alert alert-success">
              {successMsg}
            </div>
          )}
          
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="contact-form">
            <input 
              name="name" 
              placeholder="Full name" 
              value={form.name} 
              onChange={handleChange} 
              required 
              disabled={loading}
            />
            
            <input 
              name="email" 
              type="email" 
              placeholder="Email" 
              value={form.email} 
              onChange={handleChange} 
              required 
              disabled={loading}
            />
            
            <input 
              name="birthday" 
              type="date" 
              placeholder="Birthday (Must be 18+ years old)" 
              value={form.birthday} 
              onChange={handleChange} 
              required 
              disabled={loading}
            />
            
            <input 
              name="password" 
              type="password" 
              placeholder="Password (min 6 chars)" 
              value={form.password} 
              onChange={handleChange} 
              required 
              minLength={6}
              disabled={loading}
            />
            
            <input 
              name="confirmPassword" 
              type="password" 
              placeholder="Confirm Password" 
              value={form.confirmPassword} 
              onChange={handleChange} 
              required 
              minLength={6}
              disabled={loading}
            />
            
            <div style={{ textAlign: 'left', width: '85%', marginTop: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Gender:</label>
              <select 
                name="gender" 
                value={form.gender} 
                onChange={handleChange} 
                required 
                disabled={loading}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div style={{ textAlign: 'left', width: '85%', marginTop: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Account Type:</label>
              <select 
                name="accountType" 
                value={form.accountType} 
                onChange={handleChange} 
                disabled={loading}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              >
                <option value="basic">Basic</option>
                <option value="member">Member</option>
              </select>
              <small style={{ fontSize: '12px', color: '#888' }}>Note: Admin accounts can only be created by existing admins</small>
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;