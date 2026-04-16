const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  body: { type: String, required: true },
  image: { type: String, default: '' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['published', 'removed'], default: 'published' },
  reactions: {
    like: { type: Number, default: 0 },
    heart: { type: Number, default: 0 },
    haha: { type: Number, default: 0 },
    sad: { type: Number, default: 0 },
    angry: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);