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
  const [showInfo, setShowInfo] = useState(false);
  const [infoTimeout, setInfoTimeout] = useState<NodeJS.Timeout | null>(null);
  const [infoText, setInfoText] = useState('Use ⌘ + scroll to zoom the map');

  useEffect(() => {
    const initializeMap = () => {
      const mapInstance = L.map('map', {
        scrollWheelZoom: false, // Deaktiviert das Zoomen mit dem Mausrad
        dragging: true, // Aktiviert das Ziehen der Karte
      }).setView([47.3397817, 8.046936], 5); // Set initial coordinates and zoom level

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      setMap(mapInstance);

      // Event-Listener hinzufügen, um das Scroll-Zooming zu steuern
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Meta' || e.key === 'Control') { // Command-Taste auf Mac und Ctrl-Taste auf Windows/Linux
          mapInstance.scrollWheelZoom.enable();
        }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'Meta' || e.key === 'Control') { // Command-Taste auf Mac und Ctrl-Taste auf Windows/Linux
          mapInstance.scrollWheelZoom.disable();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        mapInstance.remove();
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    };

    initializeMap();

    // Überprüfen, ob es sich um ein Mobilgerät handelt
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      setInfoText('Use two fingers to move the map');
    }
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

  const handleMouseEnter = () => {
    if (infoTimeout) {
      clearTimeout(infoTimeout);
    }
    setShowInfo(true);
    const timeout = setTimeout(() => {
      setShowInfo(false);
    }, 2000);
    setInfoTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (infoTimeout) {
      clearTimeout(infoTimeout);
    }
    setShowInfo(false);
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
      <div 
        id="map" 
        style={{ width: '100%', height: '80vh', position: 'relative' }} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {showInfo && (
          <div 
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              zIndex: 2000, 
              backgroundColor: 'rgba(0, 0, 0, 0.5)', 
              color: 'white',
              padding: '10px', 
              borderRadius: '5px', 
              textAlign: 'center'
            }}
          >
            {infoText}
          </div>
        )}
      </div>
    </>
  );
};

export default LeafletMap;
