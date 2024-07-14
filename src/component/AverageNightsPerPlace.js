import React, { useEffect, useState } from 'react';
import { calculateStatistics } from '../../utils/statistics'; // Pfad anpassen, falls notwendig

const AverageNightsPerPlace = () => {
  const [averageNights, setAverageNights] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const { averageNightsPerPlace } = calculateStatistics(data);
        setAverageNights(averageNightsPerPlace);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Durchschnittliche Übernachtungen pro Ort</h2>
      <p>{averageNights.toFixed(2)} Nächte</p> {/* Anzeige auf zwei Dezimalstellen gerundet */}
    </div>
  );
};

export default AverageNightsPerPlace;
