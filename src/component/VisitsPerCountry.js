import React, { useEffect, useState } from 'react';
import { calculateStatistics } from '../../utils/statistics'; // Pfad anpassen, falls notwendig

const VisitsPerCountry = () => {
  const [visitsPerCountry, setVisitsPerCountry] = useState({});
  const [totalVisits, setTotalVisits] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const { visitsPerCountry, totalVisits } = calculateStatistics(data);
        setVisitsPerCountry(visitsPerCountry);
        setTotalVisits(totalVisits);
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
        {Object.entries(visitsPerCountry).map(([country, { visitCount, multipleVisitedPlaces, nights }]) => (
          <li key={country}>
            {country}: {visitCount} Besuche {multipleVisitedPlaces > 0 && `- ${multipleVisitedPlaces} mehrfach besuchte Orte`} {nights > 0 && `- ${nights} Nächte`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VisitsPerCountry;
