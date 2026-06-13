const express = require('express');
const router = express.Router();
const {
  createPost,
  getAdminPosts,
  getAdminPostById,
  updatePost,
  deletePost,
} = require('../controllers/adminPostController');

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');


router.route('/')
  .post(protect, upload.single('image'), createPost)
  .get(protect, getAdminPosts);

router.route('/:id')
  .get(protect, getAdminPostById)
  .put(protect, upload.single('image'), updatePost)
  .delete(protect, deletePost);

module.exports = router;
