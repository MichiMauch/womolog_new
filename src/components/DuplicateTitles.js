import React, { useEffect, useState } from 'react';
import { calculateStatistics } from '../../utils/statistics'; // Pfad anpassen, falls notwendig

const DuplicateTitles = () => {
  const [duplicateTitles, setDuplicateTitles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const { duplicateTitles } = calculateStatistics(data);
        setDuplicateTitles(duplicateTitles);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Liste der doppelten Titel</h2>
      <ul>
        {duplicateTitles.map(({ title, count, years }, index) => (
          <li key={index}>
            {title} - {count} Mal besucht ({years.join(', ')})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DuplicateTitles;
