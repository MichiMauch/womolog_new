import React, { useEffect, useState } from 'react';
import { calculateStatistics } from '../../utils/statistics'; // Pfad anpassen, falls notwendig

const SeasonAnalysis = () => {
  const [seasons, setSeasons] = useState({ Winter: 0, Frühling: 0, Sommer: 0, Herbst: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const { seasons } = calculateStatistics(data);
        setSeasons(seasons);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Jahreszeiten-Analyse</h2>
      <ul>
        <li>Winter: {seasons.Winter} Reisen</li>
        <li>Frühling: {seasons.Frühling} Reisen</li>
        <li>Sommer: {seasons.Sommer} Reisen</li>
        <li>Herbst: {seasons.Herbst} Reisen</li>
      </ul>
    </div>
  );
};

export default SeasonAnalysis;
