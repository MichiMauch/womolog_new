import React, { useEffect, useRef } from 'react';
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
  fullHeight?: boolean;
};

const LeafletMap: React.FC<Props> = ({ data, fullHeight = true }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const mapInstance = L.map(mapRef.current, {
        scrollWheelZoom: false,
        dragging: true,
      }).setView([47.3397817, 8.046936], 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      mapInstanceRef.current = mapInstance;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Meta' || e.key === 'Control') {
          mapInstance.scrollWheelZoom.enable();
        }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'Meta' || e.key === 'Control') {
          mapInstance.scrollWheelZoom.disable();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        mapInstance.remove();
        mapInstanceRef.current = null;
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [mapRef]);

  useEffect(() => {
    if (mapInstanceRef.current && data.length > 0) {
      data.forEach(([title, location, dateFrom, dateTo, imageLinks, latitude, longitude]) => {
        if (latitude && longitude) {
          const imageUrl = imageLinks ? `https://pub-7b46ce1a4c0f4ff6ad2ed74d56e2128a.r2.dev/${imageLinks}.webp` : '';
          const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

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
            .addTo(mapInstanceRef.current!)
            .bindPopup(popupContent);
        }
      });
    }
  }, [data]);

  return (
    <>
      <button 
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              const { latitude, longitude } = position.coords;
              mapInstanceRef.current?.setView([latitude, longitude], 13);
            });
          }
        }} 
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
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: fullHeight ? '100vh' : '100%', 
          position: fullHeight ? 'absolute' : 'relative', 
          top: fullHeight ? 0 : undefined, 
          bottom: fullHeight ? 0 : undefined, 
          left: fullHeight ? 0 : undefined, 
          right: fullHeight ? 0 : undefined 
        }}  // Volle Höhe und Breite
      />
    </>
  );
};

export default LeafletMap;
