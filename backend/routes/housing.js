const express = require('express');
const {
  getAllHousings,
  getHousingById,
  createHousing,
  updateHousing,
  deleteHousing
} = require('../controllers/housingController');
const { verifyToken } = require('../controllers/authController');

const router = express.Router();

// @route   GET /api/housing
// @desc    Get all housing listings with optional filtering
// @access  Public
router.get('/', getAllHousings);

// @route   GET /api/housing/:id
// @desc    Get single housing by ID
// @access  Public
router.get('/:id', getHousingById);

// @route   POST /api/housing
// @desc    Create new housing listing
// @access  Private (requires authentication)
router.post('/', verifyToken, createHousing);

// @route   PUT /api/housing/:id
// @desc    Update housing listing
// @access  Private (requires authentication and ownership)
router.put('/:id', verifyToken, updateHousing);

// @route   DELETE /api/housing/:id
// @desc    Delete housing listing
// @access  Private (requires authentication and ownership)
router.delete('/:id', verifyToken, deleteHousing);

module.exports = router;