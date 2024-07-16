import React, { useEffect, useState } from 'react';
import { calculateRouteDistance } from '../../utils/route-service';

// Funktion zum Parsen von Datumsangaben im Format dd.mm.yyyy
function parseDate(dateString) {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day); // month - 1, da Monate in JS von 0-11 sind
}

const TotalDistance = () => {
    const [yearlyDistances, setYearlyDistances] = useState({});
    const homeCoordinates = [47.33891, 8.05069];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/sheetData');
                const data = await response.json();

                // Debugging-Ausgabe der Originaldaten
                console.log('Original Data:', data);

                // Gruppieren der Daten nach Jahren
                const groupedData = data.reduce((acc, row) => {
                    const startDate = parseDate(row[2]);
                    const year = startDate.getFullYear();
                    if (!acc[year]) {
                        acc[year] = [];
                    }
                    acc[year].push(row);
                    return acc;
                }, {});

                const distances = {};

                for (const year in groupedData) {
                    const dataForYear = groupedData[year];

                    // Debugging-Ausgabe der gefilterten Daten
                    console.log(`Filtered Data for ${year}:`, dataForYear);

                    // Extrahieren der Koordinaten für die gefilterten Daten
                    let waypoints = [];

                    for (let i = 0; i < dataForYear.length; i++) {
                        const lat = parseFloat(dataForYear[i][5]);
                        const lon = parseFloat(dataForYear[i][6]);
                        const dateAb = parseDate(dataForYear[i][3]);

                        if (!isNaN(lat) && !isNaN(lon)) {
                            waypoints.push([lat, lon]);

                            if (i < dataForYear.length - 1) {
                                const nextDateAn = parseDate(dataForYear[i + 1][2]);
                                if (dateAb.getTime() !== nextDateAn.getTime()) {
                                    waypoints.push(homeCoordinates); // Zurück nach Hause
                                    waypoints.push(homeCoordinates); // Wieder von zu Hause starten
                                }
                            }
                        } else {
                            console.log(`Invalid coordinates: [${lat}, ${lon}] for row:`, dataForYear[i]);
                        }
                    }

                    waypoints.unshift(homeCoordinates); // Start von zu Hause
                    waypoints.push(homeCoordinates); // Enden zu Hause

                    // Debugging-Ausgabe der Waypoints
                    console.log(`Waypoints for ${year}:`, waypoints);

                    const distance = await calculateRouteDistance(waypoints);
                    distances[year] = Math.round(distance); // Ausgabe auf ganze Kilometer runden
                }

                setYearlyDistances(distances);
            } catch (error) {
                console.error('Error fetching or calculating data:', error);
            }
        };

        fetchData();
    }, []);

    if (Object.keys(yearlyDistances).length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Total Distances per Year</h2>
            <ul>
                {Object.entries(yearlyDistances).map(([year, distance]) => (
                    <li key={year}>
                        {year}: {distance} km
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TotalDistance;
