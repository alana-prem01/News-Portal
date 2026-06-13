const Post = require('../models/Post');

// @desc    Get latest published posts for home page
// @route   GET /api/public/posts/home
// @access  Public
const getHomePosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: 'Published' })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get published posts by category
// @route   GET /api/public/posts/category/:category
// @access  Public
const getCategoryPosts = async (req, res) => {
  try {
    const { category } = req.params;
    const posts = await Post.find({ 
      status: 'Published', 
      category: { $regex: new RegExp(`^${category}$`, 'i') } 
    })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single full post by id
// @route   GET /api/public/posts/:id
// @access  Public
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.status !== 'Published') {
      return res.status(403).json({ message: 'Post is not published yet' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHomePosts,
  getCategoryPosts,
  getPostById,
};
