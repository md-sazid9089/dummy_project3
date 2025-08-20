const Maid = require('../models/Maid');

// Get all maids
exports.getAllMaids = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      minRate,
      maxRate,
      availability,
      experience,
      services,
      location,
      sort = '-rating'
    } = req.query;

    // Build query
    let query = { isAvailable: true };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by rate range
    if (minRate || maxRate) {
      query.rate = {};
      if (minRate) query.rate.$gte = parseFloat(minRate);
      if (maxRate) query.rate.$lte = parseFloat(maxRate);
    }

    // Filter by availability
    if (availability) {
      query.availability = availability;
    }

    // Filter by minimum experience
    if (experience) {
      query.experience = { $gte: parseInt(experience) };
    }

    // Filter by services
    if (services) {
      const serviceArray = services.split(',');
      query.services = { $in: serviceArray };
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [maids, total] = await Promise.all([
      Maid.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Maid.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: maids,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get maids error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching maid listings'
    });
  }
};

// Get single maid by ID
exports.getMaidById = async (req, res) => {
  try {
    const maid = await Maid.findById(req.params.id);

    if (!maid) {
      return res.status(404).json({
        success: false,
        message: 'Maid not found'
      });
    }

    res.status(200).json({
      success: true,
      data: maid
    });
  } catch (error) {
    console.error('Get maid error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid maid ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching maid details'
    });
  }
};

// Create new maid profile (requires authentication)
exports.createMaid = async (req, res) => {
  try {
    const maid = new Maid(req.body);
    await maid.save();

    res.status(201).json({
      success: true,
      message: 'Maid profile created successfully',
      data: maid
    });
  } catch (error) {
    console.error('Create maid error:', error);
    
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
      message: 'Server error while creating maid profile'
    });
  }
};

// Update maid (requires authentication)
exports.updateMaid = async (req, res) => {
  try {
    const maid = await Maid.findById(req.params.id);

    if (!maid) {
      return res.status(404).json({
        success: false,
        message: 'Maid not found'
      });
    }

    const updatedMaid = await Maid.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Maid profile updated successfully',
      data: updatedMaid
    });
  } catch (error) {
    console.error('Update maid error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid maid ID'
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
      message: 'Server error while updating maid profile'
    });
  }
};

// Delete maid (requires authentication)
exports.deleteMaid = async (req, res) => {
  try {
    const maid = await Maid.findById(req.params.id);

    if (!maid) {
      return res.status(404).json({
        success: false,
        message: 'Maid not found'
      });
    }

    await Maid.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Maid profile deleted successfully'
    });
  } catch (error) {
    console.error('Delete maid error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid maid ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting maid profile'
    });
  }
};

// Get maids by service type
exports.getMaidsByService = async (req, res) => {
  try {
    const { service } = req.params;
    const { page = 1, limit = 10, location, sort = '-rating' } = req.query;

    let query = { 
      services: { $in: [service] },
      isAvailable: true
    };

    // Filter by location if provided
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [maids, total] = await Promise.all([
      Maid.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Maid.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: maids,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get maids by service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching maids by service'
    });
  }
};