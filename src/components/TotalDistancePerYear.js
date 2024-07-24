import React, { useEffect, useState } from 'react';
import { calculateTotalDistance } from '../../utils/calculateRouteDistance';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

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

                    const distance = await calculateTotalDistance(waypoints);
                    distances[year] = Math.round(distance); // Ausgabe auf ganze Kilometer runden
                }

                setYearlyDistances(distances);
            } catch (error) {
                console.error('Error fetching or calculating data:', error);
            }
        };

        fetchData();
    }, []);

    const entries = Object.entries(yearlyDistances).map(([year, distance]) => ({ year, distance }));

    if (entries.length === 0) {
        return <div>Loading...</div>;
    }

    // Benutzerdefinierte Tooltip-Komponente
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded shadow-lg">
                    <p className="label">{`${label}`}</p>
                    <p className="intro">{`Kilometer: ${payload[0].value}`}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="p-4">
            <div className="text-gray-500 text-sm mb-1">Kilometer pro Jahr</div>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart layout="vertical" data={entries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" label={{ value: 'Kilometer', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis dataKey="year" type="category" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="distance" fill="#8470FF" radius={[0, 10, 10, 0]}>
                        <LabelList dataKey="distance" position="insideRight" style={{ fill: 'white' }} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TotalDistance;
