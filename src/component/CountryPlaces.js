import React, { useEffect, useState } from 'react';
import { calculateStatistics } from '../../utils/statistics'; // Pfad anpassen, falls notwendig

const VisitsPerCountry = () => {
  const [visitsPerCountry, setVisitsPerCountry] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const { visitsPerCountry } = calculateStatistics(data);
        setVisitsPerCountry(visitsPerCountry);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (Object.keys(visitsPerCountry).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Besuche pro Land</h2>
      <ul>
        {Object.entries(visitsPerCountry).map(([country, { visitCount, nights }]) => (
          <li key={country}>
            {country}: {visitCount} Besuche {nights > 0 && `- ${nights} Nächte`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VisitsPerCountry;
