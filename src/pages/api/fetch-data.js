import fetchAndSaveData from '../../../utils/fetchAndSaveData';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('Request received at /api/fetch-data');
    await fetchAndSaveData();
    res.status(200).json({ message: 'Data fetched and saved successfully on Cloudflare R2' });
  } catch (error) {
    console.error('Error in /api/fetch-data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
