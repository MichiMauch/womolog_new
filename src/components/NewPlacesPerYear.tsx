import React, { useEffect, useState } from 'react';
import { calculateStatistics } from '../../utils/statistics'; // Pfad anpassen, falls notwendig
import { FaMapMarkerAlt } from 'react-icons/fa'; // Korrektes Font Awesome Icon importieren

type VisitsPerYear = {
  [key: string]: {
    newPlaces: number;
    [key: string]: any;
  };
};

const NewPlacesPerYear: React.FC = () => {
  const [newPlacesPerYear, setNewPlacesPerYear] = useState<{ [year: string]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const { visitsPerYear }: { visitsPerYear: VisitsPerYear } = calculateStatistics(data);
        const newPlacesData = Object.entries(visitsPerYear).reduce((acc, [year, { newPlaces }]) => {
          acc[year] = newPlaces;
          return acc;
        }, {} as { [year: string]: number });
        setNewPlacesPerYear(newPlacesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (Object.keys(newPlacesPerYear).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Neue Orte pro Jahr</h2>
      <ul>
        {Object.entries(newPlacesPerYear).map(([year, count]) => (
          <li key={year} style={{ marginBottom: '10px' }}>
            <strong>{year}</strong>:
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              {[...Array(count)].map((_, index) => (
                <FaMapMarkerAlt
                  key={index}
                  style={{ width: '20px', height: '20px', margin: '2px', color: '#000' }} // Style anpassen
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewPlacesPerYear;
