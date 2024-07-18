import { calculateRouteDistance } from '../../../utils/calculateRouteDistance';

export default async function handler(req, res) {
    try {
        const { waypoints } = req.query;
        if (!waypoints) {
            throw new Error('Waypoints are required');
        }

        const parsedWaypoints = JSON.parse(waypoints);

        // Set cache headers
        const cacheTtl = 172800; // 48 Stunden
        res.setHeader('Cache-Control', `s-maxage=${cacheTtl}, stale-while-revalidate`);

        // Distance berechnen und ausgeben
        const distance = await calculateRouteDistance(parsedWaypoints);
        res.status(200).json({ distance });
    } catch (error) {
        console.error('API Error:', error.message);
        res.status(500).json({ error: error.message });
    }
}
