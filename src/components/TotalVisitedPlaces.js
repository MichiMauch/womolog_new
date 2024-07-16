import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaChartBar } from 'react-icons/fa'; // Importiere Icons
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
    <div className="flex flex-col items-start">
      <div className="flex flex-col items-start p-4">
        <div className="text-gray-500 text-sm mb-1">Total Besuchte Orte</div>
        <div className="text-black text-4xl font-semibold">{totalVisits}</div>
      </div>
      {/*
    <div className="flex flex-col items-start p-4">
      <div className="text-gray-500 text-sm mb-1">Besuchte Orte</div>
      <div className="text-black text-4xl font-semibold">{totalUniquePlaces}</div>
    </div>
    */}
    </div>
  );
};

export default TotalVisitsAndUniquePlaces;
