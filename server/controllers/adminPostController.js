const Post = require('../models/Post');

// @desc    Create a new post
// @route   POST /api/admin/posts
// @access  Private (Admin)
const createPost = async (req, res) => {
  try {
    const { title, summary, content, category, status, scheduledAt } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = req.file.path; // Cloudinary URL
    }

    const post = new Post({
      title,
      summary,
      content,
      category,
      imageUrl,
      status: status || 'Draft',
      scheduledAt: scheduledAt || null,
      author: req.user._id,
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all posts for admin (with optional status filter)
// @route   GET /api/admin/posts
// @access  Private
const getAdminPosts = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'All') {
      filter.status = status;
    }

    const posts = await Post.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Update a post
// @route   PUT /api/admin/posts/:id
// @access  Private
const updatePost = async (req, res) => {
  try {
    const { title, summary, content, category, status, scheduledAt } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.title = title || post.title;
    post.summary = summary || post.summary;
    post.content = content || post.content;
    post.category = category || post.category;
    post.status = status || post.status;
    post.scheduledAt = scheduledAt || post.scheduledAt;

    if (req.file) {
      post.imageUrl = req.file.path;
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/admin/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single post by ID for admin
// @route   GET /api/admin/posts/:id
// @access  Private
const getAdminPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getAdminPosts,
  getAdminPostById,
  updatePost,
  deletePost
};