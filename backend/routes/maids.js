const express = require('express');
const {
  getAllMaids,
  getMaidById,
  createMaid,
  updateMaid,
  deleteMaid,
  getMaidsByService
} = require('../controllers/maidController');
const { verifyToken } = require('../controllers/authController');

const router = express.Router();

// @route   GET /api/maids
// @desc    Get all maids with optional filtering
// @access  Public
router.get('/', getAllMaids);

// @route   GET /api/maids/service/:service
// @desc    Get maids by service type
// @access  Public
router.get('/service/:service', getMaidsByService);

// @route   GET /api/maids/:id
// @desc    Get single maid by ID
// @access  Public
router.get('/:id', getMaidById);

// @route   POST /api/maids
// @desc    Create new maid profile
// @access  Private (requires authentication)
router.post('/', verifyToken, createMaid);

// @route   PUT /api/maids/:id
// @desc    Update maid profile
// @access  Private (requires authentication)
router.put('/:id', verifyToken, updateMaid);

// @route   DELETE /api/maids/:id
// @desc    Delete maid profile
// @access  Private (requires authentication)
router.delete('/:id', verifyToken, deleteMaid);

module.exports = router;