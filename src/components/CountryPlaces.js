import React, { useEffect, useState } from 'react';
import { calculateStatistics } from '../../utils/statistics'; // Pfad anpassen, falls notwendig
import { FlagIcon } from 'react-flag-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faBed } from '@fortawesome/free-solid-svg-icons';

const VisitsPerCountry = () => {
  const [visitsPerCountry, setVisitsPerCountry] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sheetData');
        const data = await response.json();
        const { visitsPerCountry } = calculateStatistics(data);

        // Daten nach Anzahl der Besuche sortieren
        const sortedVisits = Object.entries(visitsPerCountry).sort((a, b) => b[1].visitCount - a[1].visitCount);
        setVisitsPerCountry(Object.fromEntries(sortedVisits));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (Object.keys(visitsPerCountry).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-start">
      <div className="flex flex-col items-start p-4">
        <div className="text-gray-500 text-sm mb-1">Orte und Nächte</div>
        <div className="text-black font-semibold">
          <div className="flex flex-wrap">
            {Object.entries(visitsPerCountry).map(([country, { visitCount, nights }]) => (
              <div key={country} className="flex items-start mb-4 w-full sm:w-1/2">
                <div className="flex items-center mb-2 mr-4">
                  <FlagIcon code={country.toUpperCase()} size={64} className="mr-4" />
                  <div>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-blue-500" />
                      {visitCount} Orte
                    </div>
                    {nights > 0 && (
                      <div className="flex items-center mt-2">
                        <FontAwesomeIcon icon={faBed} className="mr-1 text-purple-500" />
                        {nights} Nächte
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitsPerCountry;
