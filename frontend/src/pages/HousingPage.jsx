import React, { useState, useEffect } from 'react';
import { MapPin, Phone, DollarSign, User, Calendar } from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const HousingPage = () => {
  const [housings, setHousings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHousings();
  }, []);

  const fetchHousings = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/housing');
      setHousings(response.data);
    } catch (error) {
      console.error('Error fetching housings:', error);
      setError('Failed to load housing listings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Home
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              Discover affordable housing options tailored for students and bachelors
            </p>
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md">
                <div className="flex items-center justify-center space-x-8 text-center">
                  <div>
                    <div className="text-2xl font-bold">{housings.length}+</div>
                    <div className="text-primary-100">Properties</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-primary-100">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Housing Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Properties</h2>
          <p className="text-gray-600">Browse through our curated selection of housing options</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {housings.length > 0 ? (
            housings.map((housing) => (
              <div key={housing._id} className="card overflow-hidden group">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {housing.images && housing.images.length > 0 ? (
                    <img
                      src={housing.images[0]}
                      alt={housing.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                      {housing.title}
                    </h3>
                    <div className="flex items-center text-secondary-600 font-bold">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>${housing.rent}/mo</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{housing.location}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {housing.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Available Now</span>
                    </div>
                    <a
                      href={`tel:${housing.contact}`}
                      className="flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Contact
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <User className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Available</h3>
                <p className="text-gray-600">Check back later for new listings or contact us to add your property.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HousingPage;