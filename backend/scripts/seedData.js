const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Housing = require('../models/Housing');
const Shop = require('../models/Shop');
const Maid = require('../models/Maid');

// Load environment variables
dotenv.config();

// Sample data for seeding
const sampleHousings = [
  {
    title: "Cozy Studio Apartment in Downtown",
    description: "Perfect for students and young professionals. Fully furnished studio with modern amenities, close to universities and metro station.",
    rent: 1200,
    location: "Downtown District, New York",
    contact: "+1-555-0123",
    type: "studio",
    bedrooms: 0,
    bathrooms: 1,
    area: 450,
    amenities: ["WiFi", "Air Conditioning", "Laundry", "Security"],
    isAvailable: true,
    images: ["https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"]
  },
  {
    title: "Shared Room in Modern Apartment",
    description: "Spacious shared accommodation with 2 bedrooms, ideal for students. Great location with easy access to public transport.",
    rent: 800,
    location: "University Area, Boston",
    contact: "+1-555-0456",
    type: "shared",
    bedrooms: 2,
    bathrooms: 1,
    area: 850,
    amenities: ["WiFi", "Kitchen", "Study Area", "Parking"],
    isAvailable: true,
    images: ["https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg"]
  },
  {
    title: "Affordable Single Room",
    description: "Budget-friendly single room in a shared house. Perfect for students on a tight budget. All utilities included.",
    rent: 600,
    location: "Suburb Area, Chicago",
    contact: "+1-555-0789",
    type: "room",
    bedrooms: 1,
    bathrooms: 1,
    area: 200,
    amenities: ["WiFi", "Shared Kitchen", "Utilities Included"],
    isAvailable: true,
    images: ["https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg"]
  }
];

const sampleShops = [
  {
    shopName: "Fresh Market Grocery",
    type: "grocery",
    description: "Your one-stop shop for fresh produce, groceries, and daily essentials. Open 7 days a week.",
    location: "Main Street, Downtown",
    contact: "+1-555-1001",
    email: "info@freshmarket.com",
    hours: "7:00 AM - 10:00 PM",
    services: ["Fresh Produce", "Bakery", "Deli", "Home Delivery"],
    rating: 4.5,
    reviewCount: 128,
    isActive: true
  },
  {
    shopName: "Campus Cafe & Bistro",
    type: "restaurant",
    description: "Student-friendly cafe serving coffee, sandwiches, and quick meals. Perfect study spot with free WiFi.",
    location: "University Campus",
    contact: "+1-555-1002",
    email: "hello@campuscafe.com",
    website: "https://campuscafe.com",
    hours: "6:00 AM - 11:00 PM",
    services: ["Coffee", "Light Meals", "Free WiFi", "Study Space"],
    rating: 4.2,
    reviewCount: 85,
    isActive: true
  },
  {
    shopName: "Quick Pharmacy Plus",
    type: "pharmacy",
    description: "Full-service pharmacy with prescription medications, health products, and medical supplies.",
    location: "Health District",
    contact: "+1-555-1003",
    email: "care@quickpharmacy.com",
    hours: "8:00 AM - 9:00 PM",
    services: ["Prescriptions", "Health Checkups", "First Aid", "Consultation"],
    rating: 4.7,
    reviewCount: 96,
    isActive: true
  },
  {
    shopName: "Tech Hub Electronics",
    type: "electronics",
    description: "Latest electronics, gadgets, and computer accessories. Student discounts available.",
    location: "Shopping Center",
    contact: "+1-555-1004",
    email: "sales@techhub.com",
    website: "https://techhub.com",
    hours: "10:00 AM - 8:00 PM",
    services: ["Electronics", "Repairs", "Student Discounts", "Warranties"],
    rating: 4.3,
    reviewCount: 67,
    isActive: true
  }
];

const sampleMaids = [
  {
    name: "Maria Rodriguez",
    age: 32,
    experience: 8,
    description: "Experienced and reliable housekeeper with excellent references. Specializes in deep cleaning and organization.",
    contact: "+1-555-2001",
    email: "maria.cleaning@email.com",
    availability: "full-time",
    workingHours: "8:00 AM - 5:00 PM",
    services: ["house-cleaning", "kitchen-cleaning", "bathroom-cleaning", "laundry", "ironing"],
    rate: 25,
    rateType: "hourly",
    location: "Downtown Area",
    languages: ["English", "Spanish"],
    rating: 4.9,
    reviewCount: 45,
    isAvailable: true,
    isVerified: true
  },
  {
    name: "Sarah Johnson",
    age: 28,
    experience: 5,
    description: "Detail-oriented cleaner with a passion for creating spotless living spaces. Available for regular or one-time cleanings.",
    contact: "+1-555-2002",
    email: "sarah.clean@email.com",
    availability: "part-time",
    workingHours: "Flexible - Weekdays",
    services: ["house-cleaning", "dusting", "mopping", "vacuuming", "window-cleaning"],
    rate: 22,
    rateType: "hourly",
    location: "University District",
    languages: ["English"],
    rating: 4.7,
    reviewCount: 32,
    isAvailable: true,
    isVerified: true
  },
  {
    name: "Emily Chen",
    age: 35,
    experience: 12,
    description: "Professional cleaning service with over a decade of experience. Trusted by families and professionals alike.",
    contact: "+1-555-2003",
    email: "emily.cleaning@email.com",
    availability: "flexible",
    workingHours: "7 days a week",
    services: ["deep-cleaning", "cooking", "dishwashing", "laundry", "house-cleaning"],
    rate: 30,
    rateType: "hourly",
    location: "Suburb Area",
    languages: ["English", "Mandarin"],
    rating: 4.8,
    reviewCount: 78,
    isAvailable: true,
    isVerified: true
  },
  {
    name: "Jennifer Williams",
    age: 26,
    experience: 3,
    description: "Young and energetic cleaner offering affordable rates for students and young professionals.",
    contact: "+1-555-2004",
    email: "jen.cleaning@email.com",
    availability: "weekends",
    workingHours: "Saturday - Sunday",
    services: ["house-cleaning", "kitchen-cleaning", "bathroom-cleaning", "dusting"],
    rate: 18,
    rateType: "hourly",
    location: "Campus Area",
    languages: ["English"],
    rating: 4.4,
    reviewCount: 23,
    isAvailable: true,
    isVerified: false
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bachelor-solution');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Housing.deleteMany({});
    await Shop.deleteMany({});
    await Maid.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample data
    await Housing.insertMany(sampleHousings);
    console.log(`${sampleHousings.length} housing listings inserted`);

    await Shop.insertMany(sampleShops);
    console.log(`${sampleShops.length} shops inserted`);

    await Maid.insertMany(sampleMaids);
    console.log(`${sampleMaids.length} maid profiles inserted`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;