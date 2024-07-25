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

        // Sortieren der Titel nach Anzahl der Besuche in absteigender Reihenfolge
        const sortedTitles = duplicateTitles.sort((a, b) => b.count - a.count);

        // Nur die Top 10 Titel speichern
        setDuplicateTitles(sortedTitles.slice(0, 10));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-start">
      <div className="flex flex-col items-start p-4">
        <div className="text-gray-500 text-sm mb-1">Mehrfach besuchte Orte</div>
        <div className="text-black font-semibold"><ul>
        {duplicateTitles.map(({ title, count, years }, index) => (
          <li key={index}>
            {title} - {count} Mal besucht ({years.join(', ')})
          </li>
        ))}
      </ul>
      </div>
      </div>
    </div>
  );
};

export default DuplicateTitles;
