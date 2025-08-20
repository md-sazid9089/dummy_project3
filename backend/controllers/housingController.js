const Housing = require('../models/Housing');

// Get all housing listings
exports.getAllHousings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      minRent,
      maxRent,
      type,
      location,
      sort = '-createdAt'
    } = req.query;

    // Build query
    let query = { isAvailable: true };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by rent range
    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = parseFloat(minRent);
      if (maxRent) query.rent.$lte = parseFloat(maxRent);
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [housings, total] = await Promise.all([
      Housing.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('landlord', 'name email phone'),
      Housing.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: housings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get housings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching housing listings'
    });
  }
};

// Get single housing by ID
exports.getHousingById = async (req, res) => {
  try {
    const housing = await Housing.findById(req.params.id)
      .populate('landlord', 'name email phone');

    if (!housing) {
      return res.status(404).json({
        success: false,
        message: 'Housing not found'
      });
    }

    res.status(200).json({
      success: true,
      data: housing
    });
  } catch (error) {
    console.error('Get housing error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid housing ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching housing details'
    });
  }
};

// Create new housing (requires authentication)
exports.createHousing = async (req, res) => {
  try {
    const housingData = {
      ...req.body,
      landlord: req.user._id
    };

    const housing = new Housing(housingData);
    await housing.save();

    await housing.populate('landlord', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Housing created successfully',
      data: housing
    });
  } catch (error) {
    console.error('Create housing error:', error);
    
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
      message: 'Server error while creating housing'
    });
  }
};

// Update housing (requires authentication and ownership)
exports.updateHousing = async (req, res) => {
  try {
    const housing = await Housing.findById(req.params.id);

    if (!housing) {
      return res.status(404).json({
        success: false,
        message: 'Housing not found'
      });
    }

    // Check ownership (only landlord or admin can update)
    if (housing.landlord.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this housing'
      });
    }

    const updatedHousing = await Housing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('landlord', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Housing updated successfully',
      data: updatedHousing
    });
  } catch (error) {
    console.error('Update housing error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid housing ID'
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
      message: 'Server error while updating housing'
    });
  }
};

// Delete housing (requires authentication and ownership)
exports.deleteHousing = async (req, res) => {
  try {
    const housing = await Housing.findById(req.params.id);

    if (!housing) {
      return res.status(404).json({
        success: false,
        message: 'Housing not found'
      });
    }

    // Check ownership (only landlord or admin can delete)
    if (housing.landlord.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this housing'
      });
    }

    await Housing.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Housing deleted successfully'
    });
  } catch (error) {
    console.error('Delete housing error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid housing ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting housing'
    });
  }
};