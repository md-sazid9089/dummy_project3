import React, { useState, useEffect } from 'react';
import { Users, Star, Phone, Clock, DollarSign, CheckCircle } from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const MaidPage = () => {
  const [maids, setMaids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMaids();
  }, []);

  const fetchMaids = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/maids');
      setMaids(response.data);
    } catch (error) {
      console.error('Error fetching maids:', error);
      setError('Failed to load maid services');
    } finally {
      setLoading(false);
    }
  };

  const getExperienceColor = (years) => {
    if (years >= 5) return 'text-green-600 bg-green-50';
    if (years >= 2) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
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
      {/* Header Section */}
      <div className="bg-gradient-to-r from-secondary-600 to-secondary-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Professional Maid Services
          </h1>
          <p className="text-lg text-secondary-100 mb-6">
            Find reliable and experienced cleaning professionals in your area
          </p>
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold">{maids.length}+</div>
              <div className="text-secondary-100">Available Maids</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">4.8★</div>
              <div className="text-secondary-100">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-secondary-100">Booking</div>
            </div>
          </div>
        </div>
      </div>

      {/* Maids Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {maids.length > 0 ? (
            maids.map((maid) => (
              <div key={maid._id} className="card overflow-hidden group">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mr-3">
                        <Users className="h-6 w-6 text-secondary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                          {maid.name}
                        </h3>
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">4.8 (24 reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Experience & Rate */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getExperienceColor(maid.experience)}`}>
                      {maid.experience} years experience
                    </span>
                    <div className="flex items-center text-secondary-600 font-bold">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>${maid.rate}/hour</span>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Services Offered:</h4>
                    <div className="flex flex-wrap gap-1">
                      {maid.services && maid.services.length > 0 ? (
                        maid.services.slice(0, 3).map((service, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                            {service}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">General cleaning services</span>
                      )}
                      {maid.services && maid.services.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{maid.services.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Availability & Contact */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{maid.availability || 'Flexible hours'}</span>
                    </div>
                    <a
                      href={`tel:${maid.contact}`}
                      className="flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Contact
                    </a>
                  </div>

                  {/* Book Button */}
                  <button className="w-full mt-4 bg-secondary-500 hover:bg-secondary-600 text-white font-medium py-3 rounded-lg transition-colors duration-200">
                    Book Service
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <Users className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Maids Available</h3>
                <p className="text-gray-600">Check back later for available maid services in your area.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaidPage;