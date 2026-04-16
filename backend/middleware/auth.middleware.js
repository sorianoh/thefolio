const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token
  if (!token) {
    return res.status(401).json({ message: 'Not authorized - please log in first' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    if (user.status === 'inactive') {
      return res.status(401).json({ message: 'Account is deactivated' });
    }
    
    // Attach user to request object
    req.user = user;
    next();
    
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ message: 'Token is invalid or has expired' });
  }
};

module.exports = { protect };