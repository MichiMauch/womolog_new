import React, { useEffect, useState } from 'react';
import { calculateStatistics } from '../../utils/statistics'; // Pfad anpassen, falls notwendig
import { FaLeaf, FaTree, FaSun, FaSnowflake } from 'react-icons/fa'; // Korrekte Icons importieren

const SeasonalIcons = () => {
  const icons = {
    Frühling: <FaLeaf style={{ color: 'green', marginRight: '0.5em' }} />,
    Sommer: <FaSun style={{ color: 'orange', marginRight: '0.5em' }} />,
    Herbst: <FaTree style={{ color: 'brown', marginRight: '0.5em' }} />,
    Winter: <FaSnowflake style={{ color: 'blue', marginRight: '0.5em' }} />,
  };

  return icons;
};

const SeasonAnalysis = () => {
  const [seasons, setSeasons] = useState({ Winter: 0, Frühling: 0, Sommer: 0, Herbst: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const calculatedSeasons = calculateStatistics(data).seasons; // Umbenennen der Destrukturierung
        setSeasons(calculatedSeasons); // Setzen der berechneten Werte
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const icons = SeasonalIcons();

  return (
    <div className="flex flex-col items-start p-4">
      <div className="text-gray-500 text-sm mb-1">Jahreszeiten-Reisen</div>
      <div className="flex text-black text-4xl font-semibold">
        <div className="flex items-center">
          {icons.Frühling} {seasons.Frühling}
        </div>
        <div className="flex items-center ml-8">
          {icons.Sommer} {seasons.Sommer}
        </div>
      </div>
      <div className="flex text-black text-4xl font-semibold mt-4">
        <div className="flex items-center">
          {icons.Herbst} {seasons.Herbst}
        </div>
        <div className="flex items-center ml-8">
          {icons.Winter} {seasons.Winter}
        </div>
      </div>
    </div>
  );
};

export default SeasonAnalysis;
