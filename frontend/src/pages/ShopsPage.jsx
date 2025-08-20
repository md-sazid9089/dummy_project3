import React, { useState, useEffect } from 'react';
import { Store, MapPin, Clock, Phone, Star } from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const ShopsPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All Shops' },
    { value: 'grocery', label: 'Grocery' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'electronics', label: 'Electronics' },
  ];

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/shops');
      setShops(response.data);
    } catch (error) {
      console.error('Error fetching shops:', error);
      setError('Failed to load shop listings');
    } finally {
      setLoading(false);
    }
  };

  const filteredShops = selectedCategory === 'all' 
    ? shops 
    : shops.filter(shop => shop.type.toLowerCase() === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Local Shops & Services
            </h1>
            <p className="text-lg text-gray-600">
              Discover nearby shops and services in your area
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.value
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shops Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.length > 0 ? (
            filteredShops.map((shop) => (
              <div key={shop._id} className="card overflow-hidden group">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mr-3">
                        <Store className="h-6 w-6 text-secondary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                          {shop.shopName}
                        </h3>
                        <span className="inline-block px-2 py-1 text-xs font-medium text-primary-700 bg-primary-50 rounded-full">
                          {shop.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">4.5</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="text-sm">{shop.location}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="text-sm">{shop.hours || 'Contact for hours'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-secondary-600 font-medium">Open Now</span>
                    <a
                      href={`tel:${shop.contact}`}
                      className="flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <Store className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No {selectedCategory === 'all' ? 'Shops' : categories.find(c => c.value === selectedCategory)?.label} Found
                </h3>
                <p className="text-gray-600">
                  Try selecting a different category or check back later for new listings.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopsPage;