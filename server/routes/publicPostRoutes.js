const express = require('express');
const router = express.Router();
const {
  getHomePosts,
  getCategoryPosts,
  getPostById,
} = require('../controllers/publicPostController');


router.get('/home', getHomePosts);
router.get('/category/:category', getCategoryPosts);
router.get('/:id', getPostById);

module.exports = router;
