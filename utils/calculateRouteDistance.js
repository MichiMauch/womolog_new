import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY;
const MAX_WAYPOINTS = 50; // Beispiel für das Limit

console.log('calculateRouteDistance.js loaded');

export async function calculateRouteDistance(waypoints) {
    console.log('calculateRouteDistance called with waypoints:', waypoints);

    if (waypoints.length > MAX_WAYPOINTS) {
        throw new Error(`Too many waypoints: ${waypoints.length}. The maximum number of waypoints is ${MAX_WAYPOINTS}.`);
    }

    const coordinates = waypoints.map(point => [point[1], point[0]]);
    const radiuses = Array(coordinates.length).fill(1900); // Erhöhe den Suchradius auf 1900 Meter
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

        if (response.data && response.data.routes && response.data.routes[0]) {
            const route = response.data.routes[0];
            if (route && route.segments) {
                const distance = route.segments.reduce((total, segment) => total + segment.distance, 0);
                const distanceInKm = distance / 1000;
                console.log('Calculated Distance in Km:', distanceInKm);
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
