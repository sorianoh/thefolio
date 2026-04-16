import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API from '../api/axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setErrors(prev => ({ ...prev, [id]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    const newErrors = { name: '', email: '', message: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      setLoading(true);
      setSubmitStatus({ type: '', message: '' });
      
      try {
        // FIXED: Removed the unused 'response' variable
        await API.post('/messages', formData);
        setSubmitStatus({ 
          type: 'success', 
          message: 'Message sent successfully! The admin will respond soon.' 
        });
        setFormData({ name: '', email: '', message: '' });
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus({ type: '', message: '' });
        }, 5000);
      } catch (error) {
        setSubmitStatus({ 
          type: 'error', 
          message: error.response?.data?.message || 'Failed to send message. Please try again.' 
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <section className="content-box">
          <h2>Send a Message</h2>
          <p>If you want to know more about Coffee, feel free to send me a message using the form below.</p>
          
          {submitStatus.message && (
            <div className={`alert ${submitStatus.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {submitStatus.message}
            </div>
          )}
          
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="name">Name:</label>
            <input 
              type="text" 
              id="name" 
              placeholder="Enter your full name" 
              value={formData.name} 
              onChange={handleChange}
              disabled={loading}
            />
            <span className="error-message" style={{ display: errors.name ? 'block' : 'none' }}>{errors.name}</span>
            
            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              placeholder="example@email.com" 
              value={formData.email} 
              onChange={handleChange}
              disabled={loading}
            />
            <span className="error-message" style={{ display: errors.email ? 'block' : 'none' }}>{errors.email}</span>
            
            <label htmlFor="message">Message:</label>
            <textarea 
              id="message" 
              rows="5" 
              placeholder="Type your message here..." 
              value={formData.message} 
              onChange={handleChange}
              disabled={loading}
            ></textarea>
            <span className="error-message" style={{ display: errors.message ? 'block' : 'none' }}>{errors.message}</span>
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'SEND MESSAGE'}
            </button>
          </form>
        </section>

        <section className="content-box">
          <h2>Useful Resources</h2>
          <table className="resource-table">
            <thead>
              <tr>
                <th>Resource Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><a href="https://www.perfectdailygrind.com" target="_blank" rel="noopener noreferrer">Perfect Daily Grind</a></td>
                <td>A leading publication for coffee news, brewing guides, and industry insights.</td>
              </tr>
              <tr>
                <td><a href="https://www.sweetmarias.com" target="_blank" rel="noopener noreferrer">Sweet Maria's</a></td>
                <td>A comprehensive resource for home coffee roasting and green bean sourcing.</td>
              </tr>
              <tr>
                <td><a href="https://scae.com" target="_blank" rel="noopener noreferrer">Specialty Coffee Association</a></td>
                <td>A non-profit organization representing coffee professionals around the world.</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="content-box">
          <h2>My Location</h2>
          <p>DMMMSU SLUC, Agoo, La Union</p>
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3838.4116492379373!2d120.3664797!3d16.3274291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x339162986422533b%3A0x633633e218274028!2sDMMMSU-SLUC!5e0!3m2!1sen!2sph!4v1705100000000" 
              allowFullScreen="" 
              loading="lazy"
              title="DMMMSU SLUC Location"
            ></iframe>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;