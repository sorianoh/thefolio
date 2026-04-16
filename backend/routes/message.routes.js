const express = require('express');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');
const router = express.Router();

// POST /api/messages - Send message (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const newMessage = await Message.create({
      name,
      email,
      message,
      status: 'unread'
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully!',
      data: newMessage 
    });
  } catch (err) {
    console.error('Message error:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/messages - Get all messages (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/messages/:id/read - Mark message as read (admin only)
router.put('/:id/read', protect, adminOnly, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    message.status = 'read';
    await message.save();
    res.json({ message: 'Message marked as read', data: message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/messages/:id - Delete message (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/messages/unread/count - Get unread messages count (admin only)
router.get('/unread/count', protect, adminOnly, async (req, res) => {
  try {
    const count = await Message.countDocuments({ status: 'unread' });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;