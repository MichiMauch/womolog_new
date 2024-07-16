import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { calculateStatistics } from '../../utils/statistics'; // Pfad anpassen, falls notwendig
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then(module => module.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(module => module.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then(module => module.GeoJSON), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(module => module.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(module => module.Popup), { ssr: false });

const geoUrl = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";
const capitalCitiesUrl = "https://raw.githubusercontent.com/MichiMauch/country_capital-cities_coordinates_iso2-3/main/countries-capitalcities-coordinates-iso2-3.geojson";

const VisitsPerCountry = () => {
  const [visitsPerCountry, setVisitsPerCountry] = useState({});
  const [totalVisits, setTotalVisits] = useState(0);
  const [geoData, setGeoData] = useState(null);
  const [capitalCities, setCapitalCities] = useState([]);
  const [L, setL] = useState(null);
  const [countryNames, setCountryNames] = useState({});

  const hoverColors = ['#67BFFF', '#8470FF'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const { visitsPerCountryISO3, totalVisits, countryNamesDE } = calculateStatistics(data, 9); // 9 ist die Spalte, die die Ländercodes enthält

        setVisitsPerCountry(visitsPerCountryISO3);
        setTotalVisits(totalVisits);
        setCountryNames(countryNamesDE || {});

        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();
        setGeoData(geoData);

        const capitalResponse = await fetch(capitalCitiesUrl);
        const capitalData = await capitalResponse.json();
        setCapitalCities(capitalData.features);

        const leaflet = await import('leaflet');
        setL(leaflet);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (Object.keys(visitsPerCountry).length === 0 || !geoData || !L) {
    return <div>Loading...</div>;
  }

  const onEachFeature = (feature, layer) => {
    const countryCode = feature.id.toUpperCase();

    const defaultStyle = {
      color: visitsPerCountry.hasOwnProperty(countryCode) ? '#000000' : '#FFFFFF', // Schwarze Linie für besuchte Länder
      weight: 1.5, // Feinere Linie
      fillOpacity: 0,
    };

    layer.setStyle(defaultStyle);

    layer.on({
      mouseover: (e) => {
        if (visitsPerCountry.hasOwnProperty(countryCode)) {
          const randomColor = hoverColors[Math.floor(Math.random() * hoverColors.length)];
          e.target.setStyle({ fillOpacity: 0.5, fillColor: randomColor });
        }
      },
      mouseout: (e) => {
        e.target.setStyle({ fillOpacity: 0, fillColor: 'transparent' });
      },
    });
  };

  const europeBounds = [
    [34.5, -10.5], // Southwest coordinates
    [70, 40]      // Northeast coordinates
  ];

  return (
    <div>
      <h2>Besuche pro Land</h2>
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
          {capitalCities.map(city => {
            const isoA2 = city.properties.ISO2;
            const isoA3 = city.properties.ISO3;
            const countryData = visitsPerCountry[isoA3];

            if (!isoA2 || !countryData) {
              return null; // Skip if iso_a2 or the country has not been visited
            }

            const flagUrl = `https://flagcdn.com/48x36/${isoA2.toLowerCase()}.png`;
            const countryName = countryNames ? (countryNames[isoA3] || city.properties["Country"]) : city.properties["Country"];

            return (
              <Marker 
                key={city.properties.ISO3} 
                position={[city.geometry.coordinates[1], city.geometry.coordinates[0]]} 
                icon={L.icon({
                  iconUrl: flagUrl,
                  iconSize: [36, 24],
                  iconAnchor: [18, 12],
                  popupAnchor: [0, -12],
                })}
              >
                <Popup>
                  <div style={{ textAlign: 'center' }}>
                    <h3>{countryName}</h3>
                    <img src={flagUrl} alt={`${city.properties["Capital City"]} flag`} />
                    <p>Besuchte Orte: {countryData.visitCount}
                    <br />Anzahl Nächte: {countryData.nights}</p>
                    <p><a href="https://www.womolog.ch" target="_blank" rel="noopener noreferrer">www.womolog.ch</a></p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default VisitsPerCountry;
