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
    <div>
      <h2>Längste Reise ohne Lücken</h2>
      <p>{longestTrip} Tage</p>
    </div>
  );
};

export default LongestTrip;
