const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String, // from Cloudinary
  },
  status: {
    type: String,
    enum: ['Draft', 'Scheduled', 'In-review', 'Published'],
    default: 'Draft',
  },
  scheduledAt: {
    type: Date,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
