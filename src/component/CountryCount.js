// components/CountryCount.js
import React, { useEffect, useState } from 'react';
import { calculateCountryStats } from '../../utils/statistics'; // Pfad anpassen, falls notwendig

const CountryCount = () => {
  const [countryCount, setCountryCount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const countryCount = calculateCountryStats(data);
        setCountryCount(countryCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (countryCount === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Anzahl der besuchten Länder</h2>
      <p>{countryCount}</p>
    </div>
  );
};

export default CountryCount;
