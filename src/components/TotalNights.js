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
    <div className="flex flex-col items-start">
      <div className="flex flex-col items-start p-4">
        <div className="text-gray-500 text-sm mb-1">Total Übernachtungen</div>
        <div className="text-black text-4xl font-semibold">{totalNights}</div>
      </div>
    </div>
  );
};

export default TotalNights;
