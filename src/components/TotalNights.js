import React, { useEffect, useState } from 'react';
import { calculateStatistics } from '../../utils/statistics'; // Pfad anpassen, falls notwendig

const TotalNights = () => {
  const [totalNights, setTotalNights] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const { totalNights } = calculateStatistics(data);
        setTotalNights(totalNights);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Gesamtzahl der Übernachtungen</h2>
      <p>{totalNights} Übernachtungen</p>
    </div>
  );
};

export default TotalNights;
