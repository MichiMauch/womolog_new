import React, { useEffect, useState } from 'react';
import { calculateStatistics } from '../../utils/statistics'; // Pfad anpassen, falls notwendig

const MultipleVisitsPerPlacePerCountry = () => {
  const [visitsPerPlacePerCountry, setVisitsPerPlacePerCountry] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const { visitsPerPlacePerCountry } = calculateStatistics(data);
        setVisitsPerPlacePerCountry(visitsPerPlacePerCountry);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (Object.keys(visitsPerPlacePerCountry).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Mehrfache Besuche pro Ort pro Land</h2>
      {Object.entries(visitsPerPlacePerCountry).map(([country, places]) => (
        <div key={country}>
          <h3>{country}</h3>
          <ul>
            {Object.entries(places).map(([place, count]) => (
              count > 1 && <li key={place}>{place}: {count} Besuche</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MultipleVisitsPerPlacePerCountry;
