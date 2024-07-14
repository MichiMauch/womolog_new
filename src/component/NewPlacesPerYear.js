import React, { useEffect, useState } from 'react';
import { calculateStatistics } from '../../utils/statistics'; // Pfad anpassen, falls notwendig

const NewPlacesPerYear = () => {
  const [newPlacesPerYear, setNewPlacesPerYear] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const { visitsPerYear } = calculateStatistics(data);
        const newPlacesData = Object.entries(visitsPerYear).reduce((acc, [year, { newPlaces }]) => {
          acc[year] = newPlaces;
          return acc;
        }, {});
        setNewPlacesPerYear(newPlacesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (Object.keys(newPlacesPerYear).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Neue Orte pro Jahr</h2>
      <ul>
        {Object.entries(newPlacesPerYear).map(([year, count]) => (
          <li key={year}>
            {year}: {count} neue Orte
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewPlacesPerYear;
