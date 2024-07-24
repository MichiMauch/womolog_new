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
    <div className="flex flex-col items-start">
      <div className="flex flex-col items-start p-4">
        <div className="text-gray-500 text-sm mb-1">Meiste Übernachtungen an einem Ort</div>
        <div className="text-black text-4xl font-semibold">{mostNightsPlace.nights} Nächte </div>
        <div className="text-black text-sm mb-1">{mostNightsPlace.place}</div>

      </div>
    </div>
  );
};

export default MostNightsPlace;
