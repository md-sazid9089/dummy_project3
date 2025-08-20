const mongoose = require('mongoose');

const housingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Housing title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  rent: {
    type: Number,
    required: [true, 'Rent amount is required'],
    min: [0, 'Rent cannot be negative']
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
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Please enter a valid image URL'
    }
  }],
  type: {
    type: String,
    enum: ['apartment', 'house', 'room', 'studio', 'shared'],
    default: 'apartment'
  },
  bedrooms: {
    type: Number,
    min: [0, 'Bedrooms cannot be negative'],
    max: [10, 'Maximum 10 bedrooms allowed']
  },
  bathrooms: {
    type: Number,
    min: [0, 'Bathrooms cannot be negative'],
    max: [10, 'Maximum 10 bathrooms allowed']
  },
  area: {
    type: Number,
    min: [0, 'Area cannot be negative']
  },
  amenities: [{
    type: String,
    trim: true
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  landlord: {
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
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
housingSchema.index({ location: 'text', title: 'text', description: 'text' });
housingSchema.index({ rent: 1 });
housingSchema.index({ isAvailable: 1 });
housingSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });

module.exports = mongoose.model('Housing', housingSchema);