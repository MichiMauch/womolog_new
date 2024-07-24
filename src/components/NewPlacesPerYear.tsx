import React, { useEffect, useState } from 'react';
import { calculateStatistics } from '../../utils/statistics'; // Pfad anpassen, falls notwendig
import { FaMapMarkerAlt } from 'react-icons/fa'; // Korrektes Font Awesome Icon importieren

type VisitsPerYear = {
  [key: string]: {
    newPlaces: number;
    [key: string]: any;
  };
};

const interpolateColor = (color1: string, color2: string, factor: number) => {
  let result = color1;
  if (factor >= 1) {
    result = color2;
  } else if (factor > 0) {
    const c1 = parseInt(color1.slice(1), 16);
    const c2 = parseInt(color2.slice(1), 16);
    const r1 = (c1 >> 16) & 0xff;
    const g1 = (c1 >> 8) & 0xff;
    const b1 = c1 & 0xff;
    const r2 = (c2 >> 16) & 0xff;
    const g2 = (c2 >> 8) & 0xff;
    const b2 = c2 & 0xff;
    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));
    result = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  }
  return result;
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
    <div className="flex flex-col items-start">
      <div className="flex flex-col items-start p-4">
        <div className="text-gray-500 text-sm mb-1">Neue Orte pro Jahr</div>
          <div className="text-black font-semibold">
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {Object.entries(newPlacesPerYear).map(([year, count]) => (
                <li key={year} style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                  <strong style={{ marginRight: '10px', flexShrink: 0 }}>{year}:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    {[...Array(count)].map((_, index) => {
                      const color = interpolateColor('#8470FF', '#67BFFF', index / (count - 1));
                      return (
                        <FaMapMarkerAlt
                          key={index}
                          style={{ width: '20px', height: '20px', margin: '2px', color }} // Style anpassen
                        />
                      );
                    })}
                    <span style={{ marginLeft: '5px', fontWeight: 'bold', color: '#000' }}>{count}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
    </div>
  );
};

export default NewPlacesPerYear;
