const express = require('express');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload');
const router = express.Router();

// GET /api/posts - Public (lahat ng users makakakita)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'name profilePic')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/posts/:id - Public (lahat ng users makakakita)
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name profilePic');
    if (!post || post.status === 'removed') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/posts - Create post (member at admin lang)
router.post('/', protect, memberOrAdmin, (req, res, next) => {
  upload.single('image')(req, res, function(err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { title, body } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }
    
    let imageUrl = '';
    if (req.file) {
      imageUrl = req.file.filename;
      console.log('Image uploaded:', imageUrl);
    }
    
    const post = await Post.create({ 
      title, 
      body, 
      image: imageUrl,
      author: req.user._id,
      status: 'published',
      reactions: { like: 0, heart: 0, haha: 0, sad: 0, angry: 0 }
    });
    
    await post.populate('author', 'name profilePic');
    
    res.status(201).json(post);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/posts/:id - Edit post (owner at admin lang)
router.put('/:id', protect, memberOrAdmin, (req, res, next) => {
  upload.single('image')(req, res, function(err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (req.body.title) post.title = req.body.title;
    if (req.body.body) post.body = req.body.body;
    if (req.file) {
      post.image = req.file.filename;
      console.log('Image updated:', req.file.filename);
    }
    
    await post.save();
    await post.populate('author', 'name profilePic');
    
    res.json(post);
  } catch (err) {
    console.error('Update post error:', err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/posts/:id - Delete post (owner at admin lang)
router.delete('/:id', protect, memberOrAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;