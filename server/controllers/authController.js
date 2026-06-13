const User = require('../models/User');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};


// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await argon2.verify(user.password, password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password (Send OTP)
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    const message = `Your password reset OTP is: ${otp}\n\nIt is valid for 10 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset OTP',
        message,
      });

      res.json({ message: 'OTP sent to email' });
    } catch (error) {
  console.log('EMAIL ERROR:', error);

  user.resetOtp = undefined;
  user.resetOtpExpires = undefined;
  await user.save();

  return res.status(500).json({
    message: 'Email could not be sent',
    error: error.message,
  });
}
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Reset Password using OTP
// @route   PUT /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetOtp: otp,
      resetOtpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = await argon2.hash(newPassword);
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;

    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
    loginUser,
    getUserProfile,
    forgotPassword,
    resetPassword,
};