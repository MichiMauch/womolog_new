import axios from 'axios';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const API_KEY = process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY;
const CACHE_FILE_PATH = path.resolve(process.cwd(), 'cache', 'routeData.json');
const homeCoordinates = [47.33891, 8.05069];
const MAX_WAYPOINTS = 50;

function ensureCacheDirExists() {
    const cacheDir = path.dirname(CACHE_FILE_PATH);
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
    }
}

function parseDate(dateString) {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day); // month - 1, da Monate in JS von 0-11 sind
}

async function calculateRouteDistance(waypoints) {
    const coordinates = waypoints.map(point => [point[1], point[0]]);
    const radiuses = Array(coordinates.length).fill(1900);
    const requestBody = {
        coordinates: coordinates,
        format: 'geojson',
        radiuses: radiuses
    };

    const response = await axios.post(
        `https://api.openrouteservice.org/v2/directions/driving-car`,
        requestBody,
        {
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/json'
            }
        }
    );

    if (response.data && response.data.routes && response.data.routes[0]) {
        const route = response.data.routes[0];
        if (route && route.segments) {
            const distance = route.segments.reduce((total, segment) => total + segment.distance, 0);
            return distance / 1000; // Convert to km
        }
    }

    throw new Error('Invalid API response');
}

async function calculateTotalDistance(waypoints) {
    let totalDistance = 0;
    for (let i = 0; i < waypoints.length; i += MAX_WAYPOINTS) {
        const chunk = waypoints.slice(i, i + MAX_WAYPOINTS);
        const distance = await calculateRouteDistance(chunk);
        totalDistance += distance;
    }
    return totalDistance;
}

async function fetchAndSaveData() {
    ensureCacheDirExists(); // Sicherstellen, dass das Cache-Verzeichnis existiert

    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sheetData`;
        const response = await axios.get(apiUrl);
        const data = response.data;

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

            const distance = await calculateTotalDistance(waypoints);
            distances[year] = Math.round(distance); // Ausgabe auf ganze Kilometer runden
        }

        fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(distances, null, 2), 'utf-8');
        console.log('Data saved successfully.');
    } catch (error) {
        console.error('Error fetching or calculating data:', error);
    }
}

export default async function handler(req, res) {
    try {
        await fetchAndSaveData();
        res.status(200).json({ message: 'Data fetched and saved successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
