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
    <div className="flex flex-col items-start">
      <div className="flex flex-col items-start p-4">
        <div className="text-gray-500 text-sm mb-1">Beliebtester Monat</div>
        <div className="text-black text-4xl font-semibold">{monthNames[popularMonth - 1]}</div>
      </div>
    </div>
  );
};

export default PopularMonth;
