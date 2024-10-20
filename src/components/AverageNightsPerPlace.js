import React, { useEffect, useState } from 'react';
import { FaChartBar } from 'react-icons/fa'; // Beispiel für ein Icon, das du verwenden könntest
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
    <div className="flex flex-col items-start">
      <div className="flex flex-col items-start p-4">
        <div className="flex items-center text-gray-500 text-sm mb-1 flex items-center">
        Ø Übernachtungen pro Ort
        </div>
        <div className="text-black text-4xl font-semibold">
          {averageNights.toFixed(2)} {/* Anzeige auf zwei Dezimalstellen gerundet */}
        </div>
      </div>
    </div>
  );
};

export default AverageNightsPerPlace;
