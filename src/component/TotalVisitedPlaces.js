import React, { useEffect, useState } from 'react';
import { calculateStatistics } from '../../utils/statistics'; // Pfad anpassen, falls notwendig

const TotalVisitsAndUniquePlaces = () => {
  const [totalVisits, setTotalVisits] = useState(0);
  const [totalUniquePlaces, setTotalUniquePlaces] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const { totalVisits, totalUniquePlaces } = calculateStatistics(data);
        setTotalVisits(totalVisits);
        setTotalUniquePlaces(totalUniquePlaces);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Gesamtstatistik</h2>
      <p><strong>Gesamtzahl der Besuche: {totalVisits}</strong></p>
      <p><strong>Gesamtzahl der einzigartigen Orte: {totalUniquePlaces}</strong></p>
    </div>
  );
};

export default TotalVisitsAndUniquePlaces;
