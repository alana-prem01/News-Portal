const express = require('express');
const router = express.Router();
const { loginUser , getUserProfile , forgotPassword , resetPassword} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');


router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);

module.exports = router;