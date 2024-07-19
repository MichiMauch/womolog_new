import React, { useEffect, useState } from 'react';
import { calculateStatistics } from '../../utils/statistics'; // Pfad anpassen, falls notwendig

const LongestTrip = () => {
  const [longestTrip, setLongestTrip] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const { longestTrip } = calculateStatistics(data);
        setLongestTrip(longestTrip);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-start">
      <div className="flex flex-col items-start p-4">
        <div className="text-gray-500 text-sm mb-1">Längste Reise</div>
        <div className="text-black text-4xl font-semibold">{longestTrip} Tage</div>
      </div>
    </div>
  );
};

export default LongestTrip;
