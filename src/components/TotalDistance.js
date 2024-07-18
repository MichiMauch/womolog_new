import React, { useEffect, useState } from 'react';
//import { calculateRouteDistance } from '../pages/api/route-service';

// Funktion zum Parsen von Datumsangaben im Format dd.mm.yyyy
function parseDate(dateString) {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day); // month - 1, da Monate in JS von 0-11 sind
}

const TotalDistances = () => {
    const [totalDistance, setTotalDistance] = useState(0);
    const [yearlyDistances, setYearlyDistances] = useState({});
    const homeCoordinates = [47.33891, 8.05069];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/sheetData');
                const data = await response.json();

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

                const yearlyDistances = {};

                for (const year in groupedData) {
                    const dataForYear = groupedData[year];

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
                                    waypoints.push(homeCoordinates);
                                }
                            }
                        }
                    }

                    waypoints.unshift(homeCoordinates);
                    waypoints.push(homeCoordinates);

                    const distance = await calculateRouteDistance(waypoints);
                    yearlyDistances[year] = distance;
                }

                const totalDistance = Object.values(yearlyDistances).reduce((acc, distance) => acc + distance, 0);

                setYearlyDistances(yearlyDistances);
                setTotalDistance(totalDistance);
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
        <div>
            <h2>Gesamtdistanzen</h2>
            <p><strong>Gesamtdistanz: {totalDistance.toFixed(0)} km</strong></p>
        </div>
    );
};

export default TotalDistances;
