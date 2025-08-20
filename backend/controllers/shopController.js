const Shop = require('../models/Shop');

// Get all shops
exports.getAllShops = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      location,
      sort = '-rating'
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by type
    if (type) {
      query.type = type.toLowerCase();
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [shops, total] = await Promise.all([
      Shop.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('owner', 'name email phone'),
      Shop.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: shops,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get shops error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching shop listings'
    });
  }
};

// Get single shop by ID
exports.getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)
      .populate('owner', 'name email phone');

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    res.status(200).json({
      success: true,
      data: shop
    });
  } catch (error) {
    console.error('Get shop error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid shop ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching shop details'
    });
  }
};

// Create new shop (requires authentication)
exports.createShop = async (req, res) => {
  try {
    const shopData = {
      ...req.body,
      owner: req.user._id,
      type: req.body.type ? req.body.type.toLowerCase() : 'other'
    };

    const shop = new Shop(shopData);
    await shop.save();

    await shop.populate('owner', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Shop created successfully',
      data: shop
    });
  } catch (error) {
    console.error('Create shop error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating shop'
    });
  }
};

// Update shop (requires authentication and ownership)
exports.updateShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Check ownership (only owner or admin can update)
    if (shop.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this shop'
      });
    }

    // Ensure type is lowercase if provided
    if (req.body.type) {
      req.body.type = req.body.type.toLowerCase();
    }

    const updatedShop = await Shop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Shop updated successfully',
      data: updatedShop
    });
  } catch (error) {
    console.error('Update shop error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid shop ID'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating shop'
    });
  }
};

// Delete shop (requires authentication and ownership)
exports.deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Check ownership (only owner or admin can delete)
    if (shop.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this shop'
      });
    }

    await Shop.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Shop deleted successfully'
    });
  } catch (error) {
    console.error('Delete shop error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid shop ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting shop'
    });
  }
};

// Get shops by type
exports.getShopsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 10, location, sort = '-rating' } = req.query;

    let query = { 
      type: type.toLowerCase(),
      isActive: true
    };

    // Filter by location if provided
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [shops, total] = await Promise.all([
      Shop.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('owner', 'name email phone'),
      Shop.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: shops,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get shops by type error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching shops by type'
    });
  }
};