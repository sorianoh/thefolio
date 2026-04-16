import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import coffeeImage from '../assets/images/coffee.jpeg';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    gender: '',
    dob: '',
    interestLevel: '',
    password: '',
    terms: false
  });
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user types
    setErrors(prev => ({ ...prev, [id]: '' }));
  };

  const handleGenderChange = (e) => {
    setFormData(prev => ({ ...prev, gender: e.target.value }));
    setErrors(prev => ({ ...prev, gender: '' }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
      isValid = false;
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
      isValid = false;
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of Birth is required';
      isValid = false;
    } else {
      const age = calculateAge(formData.dob);
      if (age < 18) {
        newErrors.dob = 'You must be at least 18 years old to register.';
        isValid = false;
      }
    }

    if (!formData.interestLevel) {
      newErrors.interestLevel = 'Please select an interest level';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!formData.terms) {
      newErrors.terms = 'You must agree to the terms';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      alert('Successfully Registered!');
      setFormData({
        name: '',
        username: '',
        email: '',
        gender: '',
        dob: '',
        interestLevel: '',
        password: '',
        terms: false
      });
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <section className="registration-container">
          <div className="info-section">
            <h1>Join My Coffee Community</h1>
            <p>Interested in Coffee? Fill out the registration form.</p>
            {!imageError ? (
              <img 
                src={coffeeImage} 
                alt="Decorative Coffee" 
                className="decorative-img"
                onError={() => setImageError(true)}
              />
            ) : (
              <div style={{ 
                width: '100%', 
                maxWidth: '200px', 
                height: '200px', 
                margin: '20px auto',
                background: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
                color: '#666'
              }}>
                ☕
              </div>
            )}
            <p>By accessing and using But First Coffee, you agree to be bound by these Terms and Conditions.</p>
          </div>

          <div className="form-box">
            <h2>Registration Form</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name:</label>
                <input type="text" id="name" placeholder="Enter full name" value={formData.name} onChange={handleChange} />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Preferred Username:</label>
                <input type="text" id="username" placeholder="Choose a username" value={formData.username} onChange={handleChange} />
                {errors.username && <span className="error">{errors.username}</span>}
              </div>

              <div className="form-group">
                <label>Email Address:</label>
                <input type="email" id="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Gender:</label>
                <div className="radio-group">
                  <input type="radio" id="male" name="gender" value="male" onChange={handleGenderChange} checked={formData.gender === 'male'} />
                  <label htmlFor="male">Male</label>
                  <input type="radio" id="female" name="gender" value="female" onChange={handleGenderChange} checked={formData.gender === 'female'} />
                  <label htmlFor="female">Female</label>
                  <input type="radio" id="other" name="gender" value="other" onChange={handleGenderChange} checked={formData.gender === 'other'} />
                  <label htmlFor="other">Other</label>
                </div>
                {errors.gender && <span className="error">{errors.gender}</span>}
              </div>

              <div className="form-group">
                <label>Date of Birth:</label>
                <input type="date" id="dob" value={formData.dob} onChange={handleChange} />
                {errors.dob && <span className="error">{errors.dob}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="interestLevel">Interest Category:</label>
                <select id="interestLevel" value={formData.interestLevel} onChange={handleChange}>
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
                {errors.interestLevel && <span className="error">{errors.interestLevel}</span>}
              </div>

              <div className="form-group">
                <label>Password:</label>
                <input type="password" id="password" placeholder="Create password" value={formData.password} onChange={handleChange} />
                {errors.password && <span className="error">{errors.password}</span>}
              </div>

              <div className="terms-group">
                <input type="checkbox" id="terms" checked={formData.terms} onChange={handleChange} />
                <label htmlFor="terms">I agree to the terms and conditions</label>
                {errors.terms && <span className="error">{errors.terms}</span>}
              </div>

              <button type="submit" className="submit-btn">SUBMIT REGISTRATION</button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Register;