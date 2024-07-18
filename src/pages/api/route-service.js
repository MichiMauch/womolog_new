import axios from 'axios';
import NodeCache from 'node-cache';

const myCache = new NodeCache({ stdTTL: 172800 }); // TTL von 48 Stunden
console.log('Cache initialized');

const API_KEY = process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY;
const MAX_WAYPOINTS = 70;
const MAX_DISTANCE = 6000000;

export async function calculateRouteDistance(waypoints) {
    const cacheKey = JSON.stringify(waypoints);
    console.log('Cache key:', cacheKey);
    const cachedDistance = myCache.get(cacheKey);

    if (cachedDistance) {
        console.log('Returning cached distance:', cachedDistance);
        return cachedDistance;
    }

    console.log('Waypoints:', waypoints);
    const coordinates = waypoints.map(point => [point[1], point[0]]);
    console.log('Coordinates for API:', coordinates);

    let totalDistance = 0;
    let currentCoordinates = [];
    let currentDistance = 0;

    if (coordinates.length === 2) {
        const requestBody = {
            coordinates: coordinates,
            format: 'geojson'
        };

        console.log('Request Body for Single Destination:', JSON.stringify(requestBody, null, 2));

        try {
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

            console.log('API Response for Single Destination:', response.data);

            if (response.data && response.data.routes && response.data.routes[0]) {
                const route = response.data.routes[0];
                if (route && route.segments) {
                    const distance = route.segments.reduce((total, segment) => total + segment.distance, 0);
                    console.log('Single Destination Distance:', distance);
                    const distanceInKm = distance / 1000;
                    myCache.set(cacheKey, distanceInKm); // Cache die berechnete Distanz
                    console.log('Caching distance:', distanceInKm);
                    return distanceInKm; // Rückgabe in Kilometern
                } else {
                    console.error('Invalid route properties for Single Destination:', route);
                    return null;
                }
            } else {
                console.error('Invalid API response for Single Destination:', response.data);
                return null;
            }
        } catch (error) {
            console.error('Error fetching route data for Single Destination:', error);
            if (error.response) {
                console.error('Error Response Data for Single Destination:', JSON.stringify(error.response.data, null, 2));
                if (error.response.data.error) {
                    console.error('Error Code for Single Destination:', error.response.data.error.code);
                    console.error('Error Message for Single Destination:', error.response.data.error.message);
                }
            }
            return null;
        }
    }

    for (let i = 0; i < coordinates.length; i++) {
        currentCoordinates.push(coordinates[i]);

        if (currentCoordinates.length >= 50 || currentDistance >= 2000000) {
            const subsetCoordinates = currentCoordinates;
            console.log('Subset Coordinates for API:', subsetCoordinates);

            const requestBody = {
                coordinates: subsetCoordinates,
                format: 'geojson'
            };

            console.log('Request Body:', JSON.stringify(requestBody, null, 2));

            try {
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

                console.log('API Response:', response.data);

                if (response.data && response.data.routes && response.data.routes[0]) {
                    const route = response.data.routes[0];
                    if (route && route.segments) {
                        const distance = route.segments.reduce((total, segment) => total + segment.distance, 0);
                        console.log('Subset Distance:', distance);
                        totalDistance += distance;
                    } else {
                        console.error('Invalid route properties:', route);
                    }
                } else {
                    console.error('Invalid API response:', response.data);
                }

                currentDistance = 0;
                currentCoordinates = [coordinates[i]];
            } catch (error) {
                console.error('Error fetching route data:', error);
                if (error.response) {
                    console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2));
                    if (error.response.data.error) {
                        console.error('Error Code:', error.response.data.error.code);
                        console.error('Error Message:', error.response.data.error.message);
                    }
                }
                throw new Error('Failed to fetch route data');
            }
        }
    }

    if (currentCoordinates.length > 1) {
        const requestBody = {
            coordinates: currentCoordinates,
            format: 'geojson'
        };

        console.log('Final Request Body:', JSON.stringify(requestBody, null, 2));

        try {
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

            console.log('API Response:', response.data);

            if (response.data && response.data.routes && response.data.routes[0]) {
                const route = response.data.routes[0];
                if (route && route.segments) {
                    const distance = route.segments.reduce((total, segment) => total + segment.distance, 0);
                    console.log('Final Subset Distance:', distance);
                    totalDistance += distance;
                } else {
                    console.error('Invalid route properties:', route);
                }
            } else {
                console.error('Invalid API response:', response.data);
            }
        } catch (error) {
            console.error('Error fetching route data:', error);
            if (error.response) {
                console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2));
                if (error.response.data.error) {
                    console.error('Error Code:', error.response.data.error.code);
                    console.error('Error Message:', error.response.data.error.message);
                }
            }
            throw new Error('Failed to fetch route data');
        }
    }

    const distanceInKm = totalDistance / 1000;
    console.log('Total Distance:', distanceInKm);
    myCache.set(cacheKey, distanceInKm); // Cache die berechnete Distanz
    console.log('Caching distance:', distanceInKm);
    return distanceInKm; // Rückgabe in Kilometern
}
