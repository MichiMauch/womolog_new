import axios from 'axios';
import fs from 'fs';

const API_KEY = process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY;
const MAX_WAYPOINTS = 70;
const MAX_DISTANCE = 6000000;

const debugStream = fs.createWriteStream('debug.log', { flags: 'a' });

function logDebug(message) {
  console.log(message);
  debugStream.write(`${message}\n`);
}

async function calculateRouteDistance(waypoints) {
  logDebug('Waypoints:', JSON.stringify(waypoints, null, 2));
  const coordinates = waypoints.map(point => [point[1], point[0]]);
  logDebug('Coordinates for API:', JSON.stringify(coordinates, null, 2));

  let totalDistance = 0;
  let currentCoordinates = [];
  let currentDistance = 0;

  async function fetchSubsetDistance(subsetCoordinates) {
    const requestBody = {
      coordinates: subsetCoordinates,
      format: 'geojson'
    };

    logDebug('Request Body:', JSON.stringify(requestBody, null, 2));

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

      logDebug('API Response:', JSON.stringify(response.data, null, 2));

      if (response.data && response.data.routes && response.data.routes[0]) {
        const route = response.data.routes[0];
        if (route && route.segments) {
          const distance = route.segments.reduce((total, segment) => total + segment.distance, 0);
          logDebug('Subset Distance:', distance);
          return distance;
        } else {
          logDebug('Invalid route properties:', JSON.stringify(route, null, 2));
        }
      } else {
        logDebug('Invalid API response:', JSON.stringify(response.data, null, 2));
      }
    } catch (error) {
      logDebug('Error fetching route data:', JSON.stringify(error, null, 2));
      if (error.response) {
        logDebug('Error Response Data:', JSON.stringify(error.response.data, null, 2));
        if (error.response.data.error) {
          logDebug('Error Code:', error.response.data.error.code);
          logDebug('Error Message:', error.response.data.error.message);
        }
      }
      throw new Error('Failed to fetch route data');
    }

    return 0;
  }

  for (let i = 0; i < coordinates.length; i++) {
    currentCoordinates.push(coordinates[i]);

    if (currentCoordinates.length >= MAX_WAYPOINTS || currentDistance >= MAX_DISTANCE) {
      const subsetCoordinates = currentCoordinates;
      currentDistance = await fetchSubsetDistance(subsetCoordinates);
      totalDistance += currentDistance;

      currentDistance = 0;
      currentCoordinates = [coordinates[i]];
    }
  }

  if (currentCoordinates.length > 1) {
    currentDistance = await fetchSubsetDistance(currentCoordinates);
    totalDistance += currentDistance;
  }

  logDebug('Total Distance:', totalDistance);
  return totalDistance / 1000;
}

export default async function handler(req, res) {
  const { waypoints } = req.body;

  try {
    const distance = await calculateRouteDistance(waypoints);
    res.setHeader('Cache-Control', 'public, s-maxage=172800, stale-while-revalidate=59'); // Caching Header für 24 Stunden
    res.status(200).json({ distance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate route distance' });
  }
}
