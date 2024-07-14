import React, { useEffect, useState } from 'react';
import { calculateStatistics } from '../../utils/statistics'; // Pfad anpassen, falls notwendig

const VisitsPerYear = () => {
  const [visitsPerYear, setVisitsPerYear] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const { visitsPerYear } = calculateStatistics(data);
        setVisitsPerYear(visitsPerYear);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (Object.keys(visitsPerYear).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Besuche pro Jahr</h2>
      <ul>
        {Object.entries(visitsPerYear).map(([year, { visitCount, nights }]) => (
          <li key={year}>
            {year}: {visitCount} Besuche {nights > 0 && `- ${nights} Nächte`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VisitsPerYear;
