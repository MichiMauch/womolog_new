import axios from 'axios';
import NodeCache from 'node-cache';

const myCache = new NodeCache({ stdTTL: 172800 }); // TTL von 48 Stunden

const API_KEY = process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY;
const MAX_WAYPOINTS = 70;
const MAX_DISTANCE = 6000000;

let debugStream;

if (typeof window === 'undefined') {
  // This code will only run on the server
  const fs = await import('fs');
  debugStream = fs.createWriteStream('test_debug.log', { flags: 'a' });
}

function logDebug(message) {
  if (typeof window === 'undefined') {
    // Only log on the server
    console.log(message);
    debugStream.write(`${message}\n`);
  }
}

async function calculateRouteDistance(waypoints) {
  logDebug('calculateRouteDistance function called');
  const cacheKey = JSON.stringify(waypoints);
  logDebug(`Cache key: ${cacheKey}`);
  const cachedDistance = myCache.get(cacheKey);

  if (cachedDistance) {
    logDebug('Returning cached distance: ' + cachedDistance);
    return cachedDistance;
  }

  logDebug('Waypoints: ' + JSON.stringify(waypoints, null, 2));
  const coordinates = waypoints.map(point => [point[1], point[0]]);
  logDebug('Coordinates for API: ' + JSON.stringify(coordinates, null, 2));

  let totalDistance = 0;
  let currentCoordinates = [];
  let currentDistance = 0;

  async function fetchSubsetDistance(subsetCoordinates) {
    const requestBody = {
      coordinates: subsetCoordinates,
      format: 'geojson'
    };

    logDebug('Request Body: ' + JSON.stringify(requestBody, null, 2));

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

      logDebug('API Response Status: ' + response.status);
      logDebug('API Response Data: ' + JSON.stringify(response.data, null, 2));

      if (response.data && response.data.routes && response.data.routes[0]) {
        const route = response.data.routes[0];
        if (route && route.segments) {
          const distance = route.segments.reduce((total, segment) => total + segment.distance, 0);
          logDebug('Subset Distance: ' + distance);
          return distance;
        } else {
          logDebug('Invalid route properties: ' + JSON.stringify(route, null, 2));
        }
      } else {
        logDebug('Invalid API response: ' + JSON.stringify(response.data, null, 2));
      }
    } catch (error) {
      logDebug('Error fetching route data: ' + error.message);
      if (error.response) {
        logDebug('Error Response Status: ' + error.response.status);
        logDebug('Error Response Data: ' + JSON.stringify(error.response.data, null, 2));
        if (error.response.data.error) {
          logDebug('Error Code: ' + error.response.data.error.code);
          logDebug('Error Message: ' + error.response.data.error.message);
        }
      } else if (error.request) {
        logDebug('Error Request Data: ' + JSON.stringify(error.request, null, 2));
      } else {
        logDebug('Error Message: ' + error.message);
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

  const finalDistance = totalDistance / 1000;
  logDebug('Attempting to cache distance');
  myCache.set(cacheKey, finalDistance); // Cache die berechnete Distanz
  logDebug('Caching distance: ' + finalDistance);
  return finalDistance;
}

async function handler(req, res) {
  logDebug('Handler function called');
  const { waypoints } = req.body;

  try {
    const distance = await calculateRouteDistance(waypoints);
    res.setHeader('Cache-Control', 'public, s-maxage=172800, stale-while-revalidate=59'); // Caching Header für 24 Stunden
    res.status(200).json({ distance });
  } catch (error) {
    logDebug('Error in handler: ' + error.message);
    res.status(500).json({ error: 'Failed to calculate route distance' });
  }
}

// Simulate a request to test the handler
const req = {
  body: {
    waypoints: [
      [13.388860, 52.517037],
      [13.397634, 52.529407],
      [13.428555, 52.523219]
    ]
  }
};

const res = {
  setHeader: (name, value) => {
    logDebug(`Set header ${name}: ${value}`);
  },
  status: (statusCode) => ({
    json: (data) => {
      logDebug(`Response status ${statusCode}: ${JSON.stringify(data, null, 2)}`);
    }
  })
};

handler(req, res);
