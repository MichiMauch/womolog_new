import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { calculateStatistics } from '../../utils/statistics'; // Pfad anpassen, falls notwendig

const MapContainer = dynamic(() => import('react-leaflet').then(module => module.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(module => module.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then(module => module.GeoJSON), { ssr: false });

const geoUrl = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

const VisitsPerCountry = () => {
  const [visitsPerCountry, setVisitsPerCountry] = useState({});
  const [totalVisits, setTotalVisits] = useState(0);
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const { visitsPerCountry, totalVisits } = calculateStatistics(data, 9); // 9 ist die Spalte, die die Ländercodes enthält

        // Konvertiere die Ländercodes in Großbuchstaben für den Abgleich
        const upperCaseVisitsPerCountry = {};
        for (const [key, value] of Object.entries(visitsPerCountry)) {
          upperCaseVisitsPerCountry[key.toUpperCase()] = value;
        }

        console.log("UpperCase Visits Per Country:", upperCaseVisitsPerCountry); // Debugging-Ausgabe

        setVisitsPerCountry(upperCaseVisitsPerCountry);
        setTotalVisits(totalVisits);

        // Fetch GeoJSON data
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();
        console.log("GeoJSON Data:", geoData); // Debugging-Ausgabe
        setGeoData(geoData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (Object.keys(visitsPerCountry).length === 0 || !geoData) {
    return <div>Loading...</div>;
  }

  const onEachFeature = (feature, layer) => {
    // Verwende die `id`-Eigenschaft des GeoJSON, um die Länder zu identifizieren
    const countryCode = feature.id.toUpperCase();
    console.log("Feature ID:", feature.id); // Debugging-Ausgabe
    console.log("Country Code:", countryCode); // Debugging-Ausgabe

    if (visitsPerCountry.hasOwnProperty(countryCode)) {
      console.log(`Visited Country Found: ${countryCode}`); // Debugging-Ausgabe
      layer.setStyle({ color: '#67BFFF', weight: 3 });
    } else {
      layer.setStyle({ color: '#FFFFFF', weight: 0 });
    }

    layer.on({
      mouseover: (e) => {
        if (visitsPerCountry.hasOwnProperty(countryCode)) {
          e.target.setStyle({ fillOpacity: 0.7 });
        }
      },
      mouseout: (e) => {
        if (visitsPerCountry.hasOwnProperty(countryCode)) {
          e.target.setStyle({ fillOpacity: 1 });
        }
      },
    });
  };

  // Bounds for Europe
  const europeBounds = [
    [34.5, -10.5], // Southwest coordinates
    [70, 40]      // Northeast coordinates
  ];

  return (
    <div>
      <h2>Besuche pro Landd</h2>
      <ul>
        {Object.entries(visitsPerCountry).map(([country, { visitCount, multipleVisitedPlaces, nights }]) => (
          <li key={country}>
            {country}: {visitCount} Besuche {multipleVisitedPlaces > 0 && `- ${multipleVisitedPlaces} mehrfach besuchte Orte`} {nights > 0 && `- ${nights} Nächte`}
          </li>
        ))}
      </ul>
      <div style={{ width: "100%", height: "500px", position: "relative" }}>
        <MapContainer center={[50, 10]} zoom={4} minZoom={3} maxZoom={6} style={{ height: "100%", width: "100%" }} bounds={europeBounds}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON data={geoData} onEachFeature={onEachFeature} />
        </MapContainer>
      </div>
    </div>
  );
};

export default VisitsPerCountry;
