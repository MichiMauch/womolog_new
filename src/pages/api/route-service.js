import { calculateTotalDistance } from '../../../utils/calculateRouteDistance';

export default async function handler(req, res) {
    try {
        const { waypoints } = req.query;
        if (!waypoints) {
            throw new Error('Waypoints are required');
        }

        const parsedWaypoints = JSON.parse(waypoints);

        // Berechne die Distanz
        const distance = await calculateTotalDistance(parsedWaypoints);

        // Setze Cache-Control-Header
        const cacheTtl = 172800; // 48 Stunden
        res.setHeader('Cache-Control', `s-maxage=${cacheTtl}, stale-while-revalidate`);

        // Sende die Antwort mit dem Cache-Header
        res.status(200).json({ distance });
    } catch (error) {
        console.error('API Error:', error.message);
        res.status(500).json({ error: error.message });
    }
}
T