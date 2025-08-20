const express = require('express');
const {
  getAllShops,
  getShopById,
  createShop,
  updateShop,
  deleteShop,
  getShopsByType
} = require('../controllers/shopController');
const { verifyToken } = require('../controllers/authController');

const router = express.Router();

// @route   GET /api/shops
// @desc    Get all shops with optional filtering
// @access  Public
router.get('/', getAllShops);

// @route   GET /api/shops/type/:type
// @desc    Get shops by type
// @access  Public
router.get('/type/:type', getShopsByType);

// @route   GET /api/shops/:id
// @desc    Get single shop by ID
// @access  Public
router.get('/:id', getShopById);

// @route   POST /api/shops
// @desc    Create new shop
// @access  Private (requires authentication)
router.post('/', verifyToken, createShop);

// @route   PUT /api/shops/:id
// @desc    Update shop
// @access  Private (requires authentication and ownership)
router.put('/:id', verifyToken, updateShop);

// @route   DELETE /api/shops/:id
// @desc    Delete shop
// @access  Private (requires authentication and ownership)
router.delete('/:id', verifyToken, deleteShop);

module.exports = router;