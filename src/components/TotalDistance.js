import React, { useEffect, useState } from 'react';
import { calculateTotalDistance } from '../../utils/calculateRouteDistance';

// Funktion zum Parsen von Datumsangaben im Format dd.mm.yyyy
function parseDate(dateString) {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day); // month - 1, da Monate in JS von 0-11 sind
}

const TotalDistance = () => {
    const [totalDistance, setTotalDistance] = useState(0);
    const homeCoordinates = [47.33891, 8.05069];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/sheetData');
                const data = await response.json();

                // Debugging-Ausgabe der Originaldaten
                console.log('Original Data:', data);

                // Extrahieren der Koordinaten für die gefilterten Daten
                let waypoints = [];

                for (let i = 0; i < data.length; i++) {
                    const lat = parseFloat(data[i][5]);
                    const lon = parseFloat(data[i][6]);
                    const dateAb = parseDate(data[i][3]);

                    if (!isNaN(lat) && !isNaN(lon)) {
                        waypoints.push([lat, lon]);

                        if (i < data.length - 1) {
                            const nextDateAn = parseDate(data[i + 1][2]);
                            if (dateAb.getTime() !== nextDateAn.getTime()) {
                                waypoints.push(homeCoordinates); // Zurück nach Hause
                                waypoints.push(homeCoordinates); // Wieder von zu Hause starten
                            }
                        }
                    } else {
                        console.log(`Invalid coordinates: [${lat}, ${lon}] for row:`, data[i]);
                    }
                }

                waypoints.unshift(homeCoordinates); // Start von zu Hause
                waypoints.push(homeCoordinates); // Enden zu Hause

                // Debugging-Ausgabe der Waypoints
                console.log('Waypoints:', waypoints);

                const distance = await calculateTotalDistance(waypoints);
                setTotalDistance(Math.round(distance)); // Ausgabe auf ganze Kilometer runden
            } catch (error) {
                console.error('Error fetching or calculating data:', error);
            }
        };

        fetchData();
    }, []);

    if (totalDistance === 0) {
        return <div>Loading...</div>;
    }

    return (
    <div className="flex flex-col items-start">
      <div className="flex flex-col items-start p-4">
        <div className="text-gray-500 text-sm mb-1">Total gefahrene Kilometer</div>
        <div className="text-black text-4xl font-semibold">{totalDistance}</div>

      </div>
    </div>
    );
};

export default TotalDistance;
