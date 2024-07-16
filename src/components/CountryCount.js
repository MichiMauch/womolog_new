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
    <div className="flex flex-col items-start">
      <div className="flex flex-col items-start p-4">
        <div className="text-gray-500 text-sm mb-1">Anzahl Länder</div>
        <div className="text-black text-4xl font-semibold">{countryCount}</div>
      </div>
    </div>
  );
};

export default CountryCount;
