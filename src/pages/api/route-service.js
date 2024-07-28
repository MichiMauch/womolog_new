import { calculateTotalDistance } from '../../../utils/calculateRouteDistance';

console.log('route-service.js loaded');

export default async function handler(req, res) {
    try {
        const { waypoints } = req.query;
        if (!waypoints) {
            throw new Error('Waypoints are required');
        }

        const parsedWaypoints = JSON.parse(waypoints);
        console.log('Parsed Waypoints:', parsedWaypoints);

        // Berechne die Distanz
        console.log('Starting to calculate total distance...');
        const distance = await calculateTotalDistance(parsedWaypoints);
        console.log('Calculated Distance:', distance);


        // Sende die Antwort mit dem Cache-Header
        res.status(200).json({ distance });
        console.log('Response sent with distance:', distance);
    } catch (error) {
        console.error('API Error:', error.message);
        console.error('Stack Trace:', error.stack);
        res.status(500).json({ error: error.message });
    }
}
