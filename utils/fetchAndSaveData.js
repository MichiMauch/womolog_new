import axios from 'axios';
import AWS from 'aws-sdk';
import 'dotenv/config';

const API_KEY = process.env.NEXT_PUBLIC_OPENROUTESERVICE_API_KEY;
const BUCKET_NAME = process.env.NEXT_PUBLIC_CLOUDFLARE_BUCKET_NAME;
const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;

const s3 = new AWS.S3({
  endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
  secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  region: 'auto', // Cloudflare R2 erfordert keine spezifische Region
  signatureVersion: 'v4'
});

const homeCoordinates = [47.33891, 8.05069];
const MAX_WAYPOINTS = 50;

function parseDate(dateString) {
  const [day, month, year] = dateString.split('.').map(Number);
  return new Date(year, month - 1, day);
}

async function calculateRouteDistance(waypoints) {
  const coordinates = waypoints.map(point => [point[1], point[0]]);
  const radiuses = Array(coordinates.length).fill(1900);
  const requestBody = {
    coordinates: coordinates,
    format: 'geojson',
    radiuses: radiuses
  };

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

    if (response.data && response.data.routes && response.data.routes[0]) {
      const route = response.data.routes[0];
      if (route && route.segments) {
        const distance = route.segments.reduce((total, segment) => total + segment.distance, 0);
        return distance / 1000; // Convert to km
      }
    }

    throw new Error('Invalid API response');
  } catch (error) {
    console.error('Error in calculateRouteDistance:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function calculateTotalDistance(waypoints) {
  let totalDistance = 0;
  for (let i = 0; i < waypoints.length; i += MAX_WAYPOINTS) {
    const chunk = waypoints.slice(i, i + MAX_WAYPOINTS);
    const distance = await calculateRouteDistance(chunk);
    totalDistance += distance;
  }
  return totalDistance;
}

async function fetchAndSaveData() {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sheetData`;
    console.log('Fetching data from:', apiUrl);
    const response = await axios.get(apiUrl);
    const data = response.data;

    const groupedData = data.reduce((acc, row) => {
      const startDate = parseDate(row[2]);
      const year = startDate.getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(row);
      return acc;
    }, {});

    const distances = {};

    for (const year in groupedData) {
      const dataForYear = groupedData[year];

      let waypoints = [];

      for (let i = 0; i < dataForYear.length; i++) {
        const lat = parseFloat(dataForYear[i][5]);
        const lon = parseFloat(dataForYear[i][6]);
        const dateAb = parseDate(dataForYear[i][3]);

        if (!isNaN(lat) && !isNaN(lon)) {
          waypoints.push([lat, lon]);

          if (i < dataForYear.length - 1) {
            const nextDateAn = parseDate(dataForYear[i + 1][2]);
            if (dateAb.getTime() !== nextDateAn.getTime()) {
              waypoints.push(homeCoordinates); // Zurück nach Hause
              waypoints.push(homeCoordinates); // Wieder von zu Hause starten
            }
          }
        } else {
          console.log(`Invalid coordinates: [${lat}, ${lon}] for row:`, dataForYear[i]);
        }
      }

      waypoints.unshift(homeCoordinates); // Start von zu Hause
      waypoints.push(homeCoordinates); // Enden zu Hause

      const distance = await calculateTotalDistance(waypoints);
      distances[year] = Math.round(distance); // Ausgabe auf ganze Kilometer runden
    }

    const jsonData = JSON.stringify(distances, null, 2);

    // Speichern der Daten in Cloudflare R2
    await s3.putObject({
      Bucket: BUCKET_NAME,
      Key: 'routeData.json',
      Body: jsonData,
      ContentType: 'application/json'
    }).promise();

    console.log('Data saved successfully in Cloudflare R2.');
  } catch (error) {
    console.error('Error fetching or calculating data:', error.response ? error.response.data : error.message);
    throw error; // Fehler weiterwerfen, um sie im Handler abzufangen
  }
}

export default fetchAndSaveData;
