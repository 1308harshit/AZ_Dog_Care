import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import "./map.css"; // Ensure this CSS file has the necessary styles

// Fix for default icon issue in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

// Define bounds for Gujarat
const gujaratBounds = [
  [20.05, 68.10], // Southwest corner
  [24.70, 74.28], // Northeast corner
];

// Mock hospital data (for testing purposes)
const hospitals = [
  { "name": "Ahmedabad Civil Hospital", "lat": 23.053967, "lng": 72.603844 },
{ "name": "L. G. Hospital", "lat": 23.033208, "lng": 72.605389 },
{ "name": "New Civil Hospital, Surat", "lat": 21.1702, "lng": 72.8139 },
{ "name": "Suryakiran Hospital, Surat", "lat": 21.1732, "lng": 72.8115 },
{ "name": "Civil Hospital, Surat", "lat": 21.1698, "lng": 72.8154 },
{ "name": "Sneh Rashmi Hospital, Surat", "lat": 21.1718, "lng": 72.8143 },
{ "name": "Katargam Civil Hospital", "lat": 21.1820, "lng": 72.8321 },
{ "name": "Katargam Community Health Centre", "lat": 21.1815, "lng": 72.8330 },
{ "name": "Katargam Primary Health Centre", "lat": 21.1808, "lng": 72.8342 },
{ "name": "Katargam Urban Health Centre", "lat": 21.1835, "lng": 72.8312 },
{ "name": "Rander Civil Hospital", "lat": 21.1546, "lng": 72.8568 },
{ "name": "Rander Community Health Centre", "lat": 21.1539, "lng": 72.8575 },
{ "name": "Rander Primary Health Centre", "lat": 21.1552, "lng": 72.8562 },
{ "name": "Rander Urban Health Centre", "lat": 21.1560, "lng": 72.8558 },
{ "name": "Adajan Civil Hospital", "lat": 21.1897, "lng": 72.8248 },
{ "name": "Adajan Community Health Centre", "lat": 21.1902, "lng": 72.8239 },
{ "name": "Adajan Primary Health Centre", "lat": 21.1910, "lng": 72.8232 },
{ "name": "Adajan Urban Health Centre", "lat": 21.1889, "lng": 72.8255 },
{ "name": "Civil Hospital, Vadodara", "lat": 22.3097, "lng": 73.1876 },
{ "name": "SSG Hospital, Vadodara", "lat": 22.3097, "lng": 73.1876 },
{ "name": "Civil Hospital, Rajkot", "lat": 22.2898, "lng": 70.8071 },
{ "name": "G.G. Hospital, Rajkot", "lat": 22.2898, "lng": 70.8071 },
{ "name": "Civil Hospital, Bhavnagar", "lat": 21.7756, "lng": 72.1404 },
{ "name": "Pal Hospital, Bhavnagar", "lat": 21.7756, "lng": 72.1404 },
{ "name": "Civil Hospital, Jamnagar", "lat": 22.1353, "lng": 70.0862 },
{ "name": "G.G. Hospital, Jamnagar", "lat": 22.1353, "lng": 70.0862 },
{ "name": "Civil Hospital, Junagadh", "lat": 21.5310, "lng": 70.5029 },
{ "name": "G.G. Hospital, Junagadh", "lat": 21.5310, "lng": 70.5029 },
{ "name": "Civil Hospital, Gandhinagar", "lat": 23.0254, "lng": 72.6539 },
{ "name": "Civil Hospital, Mehsana", "lat": 23.2014, "lng": 72.3821 },
{ "name": "Civil Hospital, Anand", "lat": 22.5425, "lng": 72.9084 },
{ "name": "Civil Hospital, Bhuj", "lat": 23.2548, "lng": 70.2495 },
{ "name": "Civil Hospital, Dahod", "lat": 22.5999, "lng": 74.0999 },
{ "name": "Civil Hospital, Panchmahal", "lat": 22.5999, "lng": 73.5999 },
{ "name": "Civil Hospital, Valsad", "lat": 20.9999, "lng": 72.9999 },
{ "name": "Civil Hospital, Navsari", "lat": 20.9999, "lng": 72.7999 },
{ "name": "Civil Hospital, Narmada", "lat": 21.5999, "lng": 73.5999 },
{ "name": "Civil Hospital, Patan", "lat": 23.5999, "lng": 72.5999 },
{ "name": "Civil Hospital, Sabarkantha", "lat": 23.0999, "lng": 72.5999 },
{ "name": "Civil Hospital, Porbandar", "lat": 21.9999, "lng": 69.5999 },
{ "name": "Civil Hospital, Surendranagar", "lat": 22.5999, "lng": 71.5999 },
{ "name": "Civil Hospital, Amreli", "lat": 21.5999, "lng": 71.5999 },
{ "name": "Civil Hospital, Bharuch", "lat": 21.9999, "lng": 73.0999 },
{ "name": "Civil Hospital, Banaskantha", "lat": 23.5999, "lng": 72.0999 },
{ "name": "Civil Hospital, Gandhidham", "lat": 23.3765, "lng": 70.3973 },
{ "name": "Bhuj Community Health Centre", "lat": 23.2561, "lng": 70.2478 },
{ "name": "Bhuj Primary Health Centre", "lat": 23.2570, "lng": 70.2467 },
{ "name": "Bhuj Urban Health Center", "lat": 23.2539, "lng": 70.2502 },
{ "name": "Civil Hospital, Palanpur", "lat": 24.1750, "lng": 72.4347 },
{ "name": "General Hospital, Palanpur", "lat": 24.1748, "lng": 72.4347 },
{ "name": "Palanpur Community Health Centre", "lat": 24.179331, "lng": 72.426682 },
{ "name": "Palanpur Primary Health Centre", "lat": 23.6020, "lng": 72.0978 },
{ "name": "Palanpur Urban Health Center", "lat": 23.5987, "lng": 72.1006 }

];

// Custom component to update map center and zoom
const ChangeMapView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// Custom green icon for user's location
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Function to calculate distance between two coordinates in kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance.toFixed(2); // Return distance in km with 2 decimal places
};

// Offset function to avoid overlapping markers
const offsetLocation = (lat, lng, index, offsetFactor = 0.0001) => {
  const offsetLat = lat + (index * offsetFactor);
  const offsetLng = lng + (index * offsetFactor);
  return [offsetLat, offsetLng];
};

const PublicServices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState([23.0225, 72.5714]);
  const [zoomLevel, setZoomLevel] = useState(7);
  const [userLocation, setUserLocation] = useState(null);
  const [distancePopup, setDistancePopup] = useState({ show: false, latlng: null, distance: null, name: null });
  const [route, setRoute] = useState([]);
  const mapRef = useRef();

  // Get user location using Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);  // Optionally center map on user's location
          setZoomLevel(12);  // Zoom in on user's location
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        setZoomLevel(12); // Zoom in closer to the searched location
      } else {
        alert('Location not found!');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  const handleMarkerClick = async (lat, lng, name) => {
    if (userLocation) {
      const distance = calculateDistance(userLocation[0], userLocation[1], lat, lng);
      setDistancePopup({ show: true, latlng: [lat, lng], distance, name });

      // Fetch route from OSRM
      try {
        const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${lng},${lat}?overview=full&geometries=geojson`);
        if (response.data && response.data.routes && response.data.routes[0]) {
          const routeCoords = response.data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
          setRoute(routeCoords);  // Set the route (this will overwrite the previous one)
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    }
  };

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
        <button onClick={handleSearch}>
          Search
        </button>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        className='map-container'
        ref={mapRef}
        maxBounds={gujaratBounds}  // Limit map to Gujarat
        maxBoundsViscosity={1.0}   // Prevent dragging outside bounds
        zoomControl={false}        // Disable the default zoom control
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Render markers */}
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
        {/* Custom popup to show distance */}
        <CustomPopup />
        {/* Draw the route if available */}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
        {/* Update map center and zoom dynamically */}
        <ChangeMapView center={mapCenter} zoom={zoomLevel} />
      </MapContainer>
    </div>
  );
};

export default PublicServices;

