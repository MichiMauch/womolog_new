import { getSheetData } from './/../../../lib/googleSheets';

export default async function handler(req, res) {
  try {
    const data = await getSheetData();
    res.status(200).json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    res.status(500).json({ error: 'Failed to fetch data from Google Sheets', details: error.message });
  }
}
