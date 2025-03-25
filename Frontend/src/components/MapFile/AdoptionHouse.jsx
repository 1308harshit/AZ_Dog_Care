import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import "./map.css"; // Import CSS file for map styling

// Fix for default icon issue in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

// Define bounds for Gujarat to restrict map view
const gujaratBounds = [
  [20.05, 68.10], // Southwest corner coordinates
  [24.70, 74.28], // Northeast corner coordinates
];

// Mock hospital data for testing purposes
const hospitals = [
  { name: 'Ahmedabad Civil Hospital', lat: 23.053967, lng: 72.603844 },
  { name: 'L. G. Hospital', lat: 23.033208, lng: 72.605389 },
];

// Custom component to update map center and zoom dynamically
const ChangeMapView = ({ center, zoom }) => {
  const map = useMap(); // Access the Leaflet map instance
  useEffect(() => {
    map.setView(center, zoom); // Update the map view to new center and zoom
  }, [center, zoom, map]);
  return null;
};

// Custom green icon for user's location marker
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Function to calculate distance between two geographical coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert latitude difference to radians
  const dLon = (lon2 - lon1) * (Math.PI / 180); // Convert longitude difference to radians
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Haversine formula
  const distance = R * c; // Calculate distance in kilometers
  return distance.toFixed(2); // Return distance rounded to 2 decimal places
};

// Function to offset marker locations to avoid overlap
const offsetLocation = (lat, lng, index, offsetFactor = 0.0001) => {
  const offsetLat = lat + (index * offsetFactor); // Offset latitude
  const offsetLng = lng + (index * offsetFactor); // Offset longitude
  return [offsetLat, offsetLng]; // Return new coordinates with offset
};

const AdoptionHouse = () => {
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [mapCenter, setMapCenter] = useState([23.0225, 72.5714]); // State for map center coordinates
  const [zoomLevel, setZoomLevel] = useState(7); // State for map zoom level
  const [userLocation, setUserLocation] = useState(null); // State for user's location
  const [distancePopup, setDistancePopup] = useState({ show: false, latlng: null, distance: null, name: null }); // State for popup info
  const [route, setRoute] = useState([]); // State for route coordinates
  const mapRef = useRef(); // Ref to the map container

  // Get user's location using Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]); // Set user's location
          setMapCenter([latitude, longitude]); // Center map on user's location
          setZoomLevel(12); // Zoom in on user's location
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []); // Runs once after initial render

  // Function to handle search input and update map
  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]); // Set new map center based on search result
        setZoomLevel(12); // Zoom in closer to the searched location
      } else {
        alert('Location not found!');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  // Function to handle marker clicks and show distance and route
  const handleMarkerClick = async (lat, lng, name) => {
    if (userLocation) {
      const distance = calculateDistance(userLocation[0], userLocation[1], lat, lng);
      setDistancePopup({ show: true, latlng: [lat, lng], distance, name });

      try {
        const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${lng},${lat}?overview=full&geometries=geojson`);
        if (response.data && response.data.routes && response.data.routes[0]) {
          const routeCoords = response.data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
          setRoute(routeCoords); // Set route coordinates for display
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    }
  };

  // Custom popup component to display distance and link to Google Maps
  const CustomPopup = () => {
    if (!distancePopup.show) return null;

    const googleMapsLink = `https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${distancePopup.latlng[0]},${distancePopup.latlng[1]}`;

    return (
      <Popup position={distancePopup.latlng} closeButton={false} autoPan={false}>
        <div style={{ textAlign: 'center' }}>
          <strong>{distancePopup.name}</strong>
          <br />
          Distance: {distancePopup.distance} km
          <br />
          <a href={googleMapsLink} target="_blank" rel="noopener noreferrer">
            Open Google Maps
          </a>
        </div>
      </Popup>
    );
  };

  return (
    <div className='map-component-container'>
      <div className="map-input-container">
        <input
          type="text"
          placeholder="Enter location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        className='map-container'
        ref={mapRef}
        maxBounds={gujaratBounds}
        maxBoundsViscosity={1.0}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render markers for hospitals */}
        {hospitals.map((hospital, index) => {
          const offsetPosition = offsetLocation(hospital.lat, hospital.lng, index);
          return (
            <Marker
              key={index}
              position={offsetPosition}
              eventHandlers={{
                click: () => handleMarkerClick(hospital.lat, hospital.lng, hospital.name),
              }}
            >
              <Popup>{hospital.name}</Popup>
            </Marker>
          );
        })}
        
        {/* Mark user's location with a green marker */}
        {userLocation && (
          <Marker position={userLocation} icon={greenIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}
        
        <CustomPopup />
        {route.length > 0 && <Polyline positions={route} color="blue" />}
        <ChangeMapView center={mapCenter} zoom={zoomLevel} />
      </MapContainer>
    </div>
);
};

export default AdoptionHouse;
