const express = require('express');
const Reaction = require('../models/Reaction');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const router = express.Router();

// POST /api/reactions/:postId - Add or update reaction
router.post('/:postId', protect, memberOrAdmin, async (req, res) => {
  try {
    const { postId } = req.params;
    const { type } = req.body;
    const userId = req.user._id;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post || post.status === 'removed') {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user already reacted to this post
    let existingReaction = await Reaction.findOne({ post: postId, user: userId });

    if (existingReaction) {
      // If same reaction type, remove it (toggle off)
      if (existingReaction.type === type) {
        // Decrease the reaction count
        post.reactions[type] = Math.max(0, post.reactions[type] - 1);
        await post.save();
        await existingReaction.deleteOne();
        
        return res.json({ 
          message: 'Reaction removed',
          reactions: post.reactions,
          userReaction: null
        });
      } 
      // If different reaction type, update it
      else {
        // Decrease old reaction count
        post.reactions[existingReaction.type] = Math.max(0, post.reactions[existingReaction.type] - 1);
        // Increase new reaction count
        post.reactions[type] = (post.reactions[type] || 0) + 1;
        await post.save();
        
        existingReaction.type = type;
        await existingReaction.save();
        
        return res.json({ 
          message: 'Reaction updated',
          reactions: post.reactions,
          userReaction: type
        });
      }
    } 
    // No existing reaction, create new
    else {
      // Increase reaction count
      post.reactions[type] = (post.reactions[type] || 0) + 1;
      await post.save();
      
      await Reaction.create({
        post: postId,
        user: userId,
        type
      });
      
      return res.json({ 
        message: 'Reaction added',
        reactions: post.reactions,
        userReaction: type
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reactions/:postId/user - Get user's reaction to a post
router.get('/:postId/user', protect, async (req, res) => {
  try {
    const reaction = await Reaction.findOne({ 
      post: req.params.postId, 
      user: req.user._id 
    });
    res.json({ userReaction: reaction ? reaction.type : null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;