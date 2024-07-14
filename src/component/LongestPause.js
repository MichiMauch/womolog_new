import React, { useEffect, useState } from 'react';
import { calculateStatistics } from '../../utils/statistics'; // Pfad anpassen, falls notwendig

const LongestPause = () => {
  const [longestPause, setLongestPause] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const { longestPause } = calculateStatistics(data);
        setLongestPause(longestPause);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Längste Pause zwischen zwei Reisen</h2>
      <p>{longestPause} Tage</p>
    </div>
  );
};

export default LongestPause;
