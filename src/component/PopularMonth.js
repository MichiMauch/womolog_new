import React, { useEffect, useState } from 'react';
import { calculateStatistics } from '../../utils/statistics'; // Pfad anpassen, falls notwendig

const PopularMonth = () => {
  const [popularMonth, setPopularMonth] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const { popularMonth } = calculateStatistics(data);
        setPopularMonth(popularMonth);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

  return (
    <div>
      <h2>Beliebtester Monat</h2>
      <p>{monthNames[popularMonth - 1]}</p>
    </div>
  );
};

export default PopularMonth;
