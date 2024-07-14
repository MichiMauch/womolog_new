import React, { useEffect, useState } from 'react';
import { calculateStatistics } from '../../utils/statistics'; // Pfad anpassen, falls notwendig

const MostNightsPlace = () => {
  const [mostNightsPlace, setMostNightsPlace] = useState({ place: '', nights: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const { mostNights } = calculateStatistics(data);
        setMostNightsPlace(mostNights);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Meiste Übernachtungen in einem Ort</h2>
      <p>{mostNightsPlace.place}: {mostNightsPlace.nights} Nächte</p>
    </div>
  );
};

export default MostNightsPlace;
