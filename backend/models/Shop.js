const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: [true, 'Shop name is required'],
    trim: true,
    minlength: [2, 'Shop name must be at least 2 characters long'],
    maxlength: [100, 'Shop name cannot exceed 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Shop type is required'],
    enum: ['grocery', 'restaurant', 'pharmacy', 'clothing', 'electronics', 'bakery', 'cafe', 'other'],
    lowercase: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  contact: {
    type: String,
    required: [true, 'Contact information is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^\+?[\d\s\-\(\)]+$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  website: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Please enter a valid website URL'
    }
  },
  hours: {
    type: String,
    default: '9:00 AM - 9:00 PM',
    trim: true
  },
  services: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  reviewCount: {
    type: Number,
    min: [0, 'Review count cannot be negative'],
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  coordinates: {
    latitude: {
      type: Number,
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    longitude: {
      type: Number,
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    }
  },
  image: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Please enter a valid image URL'
    }
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
shopSchema.index({ shopName: 'text', description: 'text', type: 'text' });
shopSchema.index({ type: 1 });
shopSchema.index({ isActive: 1 });
shopSchema.index({ rating: -1 });
shopSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });

module.exports = mongoose.model('Shop', shopSchema);