import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY;

export default async function handler(req, res) {
    const { waypoints } = req.query;
    const cacheKey = JSON.stringify(waypoints);
    const cacheTtl = 172800; // 48 Stunden

    // Set cache headers
    res.setHeader('Cache-Control', `s-maxage=${cacheTtl}, stale-while-revalidate`);

    // Fetch data
    try {
        const coordinates = JSON.parse(waypoints).map(point => [point[1], point[0]]);
        const requestBody = {
            coordinates: coordinates,
            format: 'geojson'
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
                const distanceInKm = distance / 1000;
                res.status(200).json({ distance: distanceInKm });
            } else {
                res.status(500).json({ error: 'Invalid route properties' });
            }
        } else {
            res.status(500).json({ error: 'Invalid API response' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch route data', details: error.message });
    }
}
