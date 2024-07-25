import axios from 'axios';
import path from 'path';
import fs from 'fs';

const API_KEY = process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY;
const MAX_WAYPOINTS = 50;
const cacheFilePath = path.resolve(process.cwd(), 'cache', 'cache.json');

console.log('calculateRouteDistance.js loaded');

function readCache() {
    if (fs.existsSync(cacheFilePath)) {
        const data = fs.readFileSync(cacheFilePath, 'utf8');
        return JSON.parse(data);
    }
    return {};
}

function writeCache(data) {
    fs.writeFileSync(cacheFilePath, JSON.stringify(data));
}

export async function calculateRouteDistance(waypoints) {
    console.log('calculateRouteDistance called with waypoints:', waypoints);

    if (waypoints.length > MAX_WAYPOINTS) {
        throw new Error(`Too many waypoints: ${waypoints.length}. The maximum number of waypoints is ${MAX_WAYPOINTS}.`);
    }

    let cache = {};
    let cacheKey = JSON.stringify(waypoints);

    if (typeof window === 'undefined') {
        console.log('Reading from cache...');
        try {
            cache = readCache();
        } catch (error) {
            console.error('Error reading cache:', error);
        }
    }

    if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp) < 86400000) {
        console.log('Returning cached distance:', cache[cacheKey].distance);
        return cache[cacheKey].distance;
    }

    const coordinates = waypoints.map(point => [point[1], point[0]]);
    const radiuses = Array(coordinates.length).fill(1900); // Standard-Suchradius
    const requestBody = {
        coordinates: coordinates,
        format: 'geojson',
        radiuses: radiuses
    };

    try {
        console.log('Request Body:', JSON.stringify(requestBody, null, 2));

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

        console.log('API Response:', JSON.stringify(response.data, null, 2));

        if (response.data && response.data.routes && response.data.routes[0]) {
            const route = response.data.routes[0];
            if (route && route.segments) {
                const distance = route.segments.reduce((total, segment) => total + segment.distance, 0);
                const distanceInKm = distance / 1000;
                console.log('Calculated Distance in Km:', distanceInKm);

                if (typeof window === 'undefined') {
                    console.log('Caching distance:', distanceInKm);
                    cache[cacheKey] = { distance: distanceInKm, timestamp: Date.now() };
                    try {
                        writeCache(cache);
                    } catch (error) {
                        console.error('Error writing to cache:', error);
                    }
                }

                return distanceInKm;
            } else {
                throw new Error('Invalid route properties');
            }
        } else {
            throw new Error('Invalid API response');
        }
    } catch (error) {
        console.error('Error fetching route data:', error.message);
        if (error.response) {
            console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        }
        throw new Error('Failed to fetch route data');
    }
}

export async function calculateTotalDistance(waypoints) {
    console.log('calculateTotalDistance called with waypoints:', waypoints);

    let totalDistance = 0;
    for (let i = 0; i < waypoints.length; i += MAX_WAYPOINTS) {
        const chunk = waypoints.slice(i, i + MAX_WAYPOINTS);
        console.log(`Processing chunk from ${i} to ${i + MAX_WAYPOINTS}:`, chunk);
        const distance = await calculateRouteDistance(chunk);
        totalDistance += distance;
    }
    console.log('Total Distance:', totalDistance);
    return totalDistance;
}
