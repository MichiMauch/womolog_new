import React, { useEffect, useState } from 'react';
import { calculateStatistics } from '../../utils/statistics'; // Pfad anpassen, falls notwendig

const MostVisitedPlaces = () => {
  const [mostVisitedPlace, setMostVisitedPlace] = useState({ place: '', visits: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const { mostVisitedPlace } = calculateStatistics(data);
        setMostVisitedPlace(mostVisitedPlace);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Meistbesuchte Orte</h2>
      <p>{mostVisitedPlace.place}: {mostVisitedPlace.visits} Besuche</p>
    </div>
  );
};

export default MostVisitedPlaces;
