// components/LeafletMap.tsx
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const iconRetina = '/icons/bus.png';
const icon = '/icons/bus.png';
const shadow = '/icons/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: shadow,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  shadowAnchor: [16, 32],
});

type Location = {
  lat: number;
  lon: number;
};

type Props = {
  data: [string, string, string, string, string, number, number][];
};

const LeafletMap: React.FC<Props> = ({ data }) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    const mapInstance = L.map('map').setView([47.3397817, 8.046936], 5); // Set initial coordinates and zoom level

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  useEffect(() => {
    if (map && data.length > 0) {
      data.forEach(([title, location, dateFrom, dateTo, imageLinks, latitude, longitude]) => {
        if (latitude && longitude) {
          const imageUrl = imageLinks ? `https://pub-7b46ce1a4c0f4ff6ad2ed74d56e2128a.r2.dev/${imageLinks}.webp` : '';
          const googleMapsLink = currentLocation
            ? `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.lat},${currentLocation.lon}&destination=${latitude},${longitude}&travelmode=driving`
            : `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

          const popupContent = `
            <div style="text-align: center;">
              <b>${title}</b><br>
              ${location}<br>
              ${dateFrom} - ${dateTo}<br>
              ${imageUrl ? `<img src="${imageUrl}" alt="${title}" style="max-width: 100%; height: auto; margin-top: 10px;"/>` : ''}
              <br>
              <a href="${googleMapsLink}" target="_blank" rel="noopener noreferrer">Route anzeigen</a>
            </div>
          `;
          L.marker([latitude, longitude])
            .addTo(map!)
            .bindPopup(popupContent);
        }
      });
    }
  }, [map, data, currentLocation]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    }
  };

  return (
    <>
      <button 
        onClick={handleGetCurrentLocation} 
        style={{ 
          position: 'absolute', 
          bottom: '10px', 
          right: '10px', 
          zIndex: 1000,
          backgroundColor: 'white',
          border: '1px solid black',
          padding: '10px',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Aktuellen Standort abrufen
      </button>
      <div id="map" style={{ width: '100%', height: '100%' }}></div>
    </>
  );
};

export default LeafletMap;
