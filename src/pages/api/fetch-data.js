import fetchAndSaveData from '../../../utils/fetchAndSaveData';

export default async function handler(req, res) {
    try {
        await fetchAndSaveData();
        res.status(200).json({ message: 'Data fetched and saved successfully' });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
