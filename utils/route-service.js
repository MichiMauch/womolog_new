import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY; // Verwenden Sie die Umgebungsvariable
const MAX_WAYPOINTS = 70; // Maximale Anzahl an Wegpunkten pro Anfrage
const MAX_DISTANCE = 6000000; // Maximale Routenentfernung in Metern

export async function calculateRouteDistance(waypoints) {
    console.log('Waypoints:', waypoints); // Debugging-Ausgabe der Wegpunkte
    const coordinates = waypoints.map(point => [point[1], point[0]]); // [longitude, latitude]
    console.log('Coordinates for API:', coordinates); // Debugging-Ausgabe der Koordinaten

    let totalDistance = 0;
    let currentCoordinates = [];
    let currentDistance = 0;

    // Wenn es nur eine Zielkoordinate gibt, direkt eine Anfrage stellen
    if (coordinates.length === 2) {
        const requestBody = {
            coordinates: coordinates,
            format: 'geojson'
        };

        console.log('Request Body for Single Destination:', JSON.stringify(requestBody, null, 2)); // Debugging-Ausgabe des Request-Bodys

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

            console.log('API Response for Single Destination:', response.data); // Debugging-Ausgabe der API-Antwort

            if (response.data && response.data.routes && response.data.routes[0]) {
                const route = response.data.routes[0];
                if (route && route.segments) {
                    const distance = route.segments.reduce((total, segment) => total + segment.distance, 0);
                    console.log('Single Destination Distance:', distance); // Debugging-Ausgabe der Gesamtdistanz
                    return distance / 1000; // Rückgabe in Kilometern
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
                console.error('Error Response Data for Single Destination:', JSON.stringify(error.response.data, null, 2)); // Ausgabe der Fehlerantwort
                if (error.response.data.error) {
                    console.error('Error Code for Single Destination:', error.response.data.error.code);
                    console.error('Error Message for Single Destination:', error.response.data.error.message);
                }
            }
            return null;
        }
    }

    // Aufteilen der Waypoints in Blöcke von maximal 50 Waypoints oder 2.000 km Entfernung
    for (let i = 0; i < coordinates.length; i++) {
        currentCoordinates.push(coordinates[i]);

        if (currentCoordinates.length >= 50 || currentDistance >= 2000000) {
            const subsetCoordinates = currentCoordinates;
            console.log('Subset Coordinates for API:', subsetCoordinates); // Debugging-Ausgabe der Teilmenge der Koordinaten

            const requestBody = {
                coordinates: subsetCoordinates,
                format: 'geojson'
            };

            console.log('Request Body:', JSON.stringify(requestBody, null, 2)); // Debugging-Ausgabe des Request-Bodys

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

                console.log('API Response:', response.data); // Debugging-Ausgabe der API-Antwort

                if (response.data && response.data.routes && response.data.routes[0]) {
                    const route = response.data.routes[0];
                    if (route && route.segments) {
                        const distance = route.segments.reduce((total, segment) => total + segment.distance, 0);
                        console.log('Subset Distance:', distance); // Debugging-Ausgabe der Teilmenge der Gesamtdistanz
                        totalDistance += distance;
                    } else {
                        console.error('Invalid route properties:', route);
                    }
                } else {
                    console.error('Invalid API response:', response.data);
                }

                currentDistance = 0;
                currentCoordinates = [coordinates[i]]; // Starten Sie den nächsten Block
            } catch (error) {
                console.error('Error fetching route data:', error);
                if (error.response) {
                    console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2)); // Ausgabe der Fehlerantwort
                    if (error.response.data.error) {
                        console.error('Error Code:', error.response.data.error.code);
                        console.error('Error Message:', error.response.data.error.message);
                    }
                }
                throw new Error('Failed to fetch route data');
            }
        }
    }

    // Verarbeiten der letzten verbleibenden Koordinaten
    if (currentCoordinates.length > 1) {
        const requestBody = {
            coordinates: currentCoordinates,
            format: 'geojson'
        };

        console.log('Final Request Body:', JSON.stringify(requestBody, null, 2)); // Debugging-Ausgabe des letzten Request-Bodys

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

            console.log('API Response:', response.data); // Debugging-Ausgabe der API-Antwort

            if (response.data && response.data.routes && response.data.routes[0]) {
                const route = response.data.routes[0];
                if (route && route.segments) {
                    const distance = route.segments.reduce((total, segment) => total + segment.distance, 0);
                    console.log('Final Subset Distance:', distance); // Debugging-Ausgabe der Teilmenge der Gesamtdistanz
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
                console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2)); // Ausgabe der Fehlerantwort
                if (error.response.data.error) {
                    console.error('Error Code:', error.response.data.error.code);
                    console.error('Error Message:', error.response.data.error.message);
                }
            }
            throw new Error('Failed to fetch route data');
        }
    }

    console.log('Total Distance:', totalDistance); // Debugging-Ausgabe der Gesamtdistanz
    return totalDistance / 1000; // Rückgabe in Kilometern
}

export async function calculateExampleRouteDistance() {
    const homeCoordinates = [8.05069, 47.33891];
    const targetCoordinates1 = [8.15221, 46.78531]; // Lungern
    const targetCoordinates2 = [7.4474, 46.9481]; // Bern

    const coordinates = [
        homeCoordinates,
        targetCoordinates1,
        targetCoordinates2,
        homeCoordinates
    ];

    const requestBody = {
        coordinates: coordinates,
        format: 'geojson'
    };

    console.log('Request Body for Example Route:', JSON.stringify(requestBody, null, 2)); // Debugging-Ausgabe des Request-Bodys

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

        console.log('API Response for Example Route:', response.data); // Debugging-Ausgabe der API-Antwort

        if (response.data && response.data.routes && response.data.routes[0]) {
            const route = response.data.routes[0];
            if (route && route.segments) {
                const distance = route.segments.reduce((total, segment) => total + segment.distance, 0);
                console.log('Example Route Distance:', distance); // Debugging-Ausgabe der Gesamtdistanz
                return distance / 1000; // Rückgabe in Kilometern
            } else {
                console.error('Invalid route properties in Example Route:', route);
                return null;
            }
        } else {
            console.error('Invalid API response for Example Route:', response.data);
            return null;
        }
    } catch (error) {
        console.error('Error fetching route data for Example Route:', error);
        if (error.response) {
            console.error('Error Response Data for Example Route:', JSON.stringify(error.response.data, null, 2)); // Ausgabe der Fehlerantwort
            if (error.response.data.error) {
                console.error('Error Code for Example Route:', error.response.data.error.code);
                console.error('Error Message for Example Route:', error.response.data.error.message);
            }
        }
        return null;
    }
}
