const mongoose = require('mongoose');

const maidSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Maid name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  age: {
    type: Number,
    min: [18, 'Age must be at least 18'],
    max: [70, 'Age cannot exceed 70']
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience cannot exceed 50 years']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
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
  availability: {
    type: String,
    enum: ['full-time', 'part-time', 'weekends', 'flexible'],
    default: 'flexible'
  },
  workingHours: {
    type: String,
    default: 'Flexible',
    trim: true
  },
  services: [{
    type: String,
    required: true,
    trim: true,
    enum: [
      'house-cleaning',
      'kitchen-cleaning',
      'bathroom-cleaning',
      'laundry',
      'ironing',
      'cooking',
      'dishwashing',
      'dusting',
      'mopping',
      'vacuuming',
      'window-cleaning',
      'deep-cleaning'
    ]
  }],
  rate: {
    type: Number,
    required: [true, 'Rate is required'],
    min: [1, 'Rate must be at least $1'],
    max: [200, 'Rate cannot exceed $200 per hour']
  },
  rateType: {
    type: String,
    enum: ['hourly', 'daily', 'weekly', 'monthly'],
    default: 'hourly'
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  languages: [{
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
  isAvailable: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Please enter a valid image URL'
    }
  },
  documents: {
    idProof: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+\.(jpg|jpeg|png|pdf)$/i.test(v);
        },
        message: 'Please enter a valid document URL'
      }
    },
    policeVerification: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+\.(jpg|jpeg|png|pdf)$/i.test(v);
        },
        message: 'Please enter a valid document URL'
      }
    }
  },
  references: [{
    name: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    relationship: {
      type: String,
      trim: true
    }
  }],
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
maidSchema.index({ name: 'text', description: 'text', services: 'text' });
maidSchema.index({ isAvailable: 1 });
maidSchema.index({ rating: -1 });
maidSchema.index({ rate: 1 });
maidSchema.index({ experience: -1 });
maidSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });

module.exports = mongoose.model('Maid', maidSchema);