import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Home, Store, Users } from 'lucide-react';

const MapPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const locations = [
    { id: 1, type: 'housing', name: 'Sunset Apartments', lat: 40.7589, lng: -73.9851, rent: '$1200/mo' },
    { id: 2, type: 'housing', name: 'Downtown Studio', lat: 40.7614, lng: -73.9776, rent: '$1000/mo' },
    { id: 3, type: 'shop', name: 'Fresh Grocery', lat: 40.7505, lng: -73.9934, category: 'Grocery' },
    { id: 4, type: 'shop', name: 'Tech Store', lat: 40.7549, lng: -73.9840, category: 'Electronics' },
    { id: 5, type: 'maid', name: 'Maria Cleaning Service', lat: 40.7580, lng: -73.9855, rate: '$25/hr' },
    { id: 6, type: 'maid', name: 'Professional Cleaners', lat: 40.7520, lng: -73.9900, rate: '$30/hr' },
  ];

  const categories = [
    { value: 'all', label: 'All Services', icon: MapPin },
    { value: 'housing', label: 'Housing', icon: Home },
    { value: 'shop', label: 'Shops', icon: Store },
    { value: 'maid', label: 'Maids', icon: Users },
  ];

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to NYC coordinates
          setUserLocation({
            lat: 40.7580,
            lng: -73.9855,
          });
          setLoading(false);
        }
      );
    } else {
      setUserLocation({
        lat: 40.7580,
        lng: -73.9855,
      });
      setLoading(false);
    }
  };

  const filteredLocations = selectedCategory === 'all' 
    ? locations 
    : locations.filter(location => location.type === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Navigation className="h-12 w-12 text-primary-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Getting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Nearby Services Map</h1>
          
          {/* Category Filter */}
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                    selectedCategory === category.value
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="flex-1 relative bg-gray-100 min-h-96">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
            <MapPin className="h-16 w-16 text-primary-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Map</h3>
            <p className="text-gray-600 mb-4">
              Map functionality will show your location and nearby services
            </p>
            <div className="text-sm text-gray-500">
              <p>Your location: {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Unknown'}</p>
              <p>Showing {filteredLocations.length} locations</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10 max-w-xs">
          <h3 className="font-semibold text-gray-900 mb-2">Legend</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-primary-500"></div>
              <span>Housing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-secondary-500"></div>
              <span>Shops</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-accent-500"></div>
              <span>Maid Services</span>
            </div>
            <div className="flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-gray-600" />
              <span>Your Location</span>
            </div>
          </div>
        </div>
      </div>

      {/* Location List */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Nearby {selectedCategory === 'all' ? 'Services' : categories.find(c => c.value === selectedCategory)?.label}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocations.map((location) => (
              <div key={location.id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{location.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    location.type === 'housing' ? 'bg-primary-100 text-primary-700' :
                    location.type === 'shop' ? 'bg-secondary-100 text-secondary-700' :
                    'bg-accent-100 text-accent-700'
                  }`}>
                    {location.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {location.rent || location.rate || location.category}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;