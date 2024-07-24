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
    <div className="flex flex-col items-start">
      <div className="flex flex-col items-start p-4">
        <div className="text-gray-500 text-sm mb-1">Meistbesuchter Ort</div>
        <div className="text-black text-4xl font-semibold">{mostVisitedPlace.visits} Besuche</div>
        <div className="text-black text-sm mb-1">{mostVisitedPlace.place}</div>

      </div>
    </div>
  );
};

export default MostVisitedPlaces;
