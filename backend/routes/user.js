const express = require('express');
const {
  getProfile,
  updateProfile,
  deleteAccount,
  getUserStats
} = require('../controllers/userController');
const { verifyToken } = require('../controllers/authController');

const router = express.Router();

// All routes in this file require authentication
router.use(verifyToken);

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', getProfile);

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', updateProfile);

// @route   DELETE /api/user/profile
// @desc    Delete user account
// @access  Private
router.delete('/profile', deleteAccount);

// @route   GET /api/user/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', getUserStats);

module.exports = router;