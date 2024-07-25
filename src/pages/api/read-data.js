import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const filePath = path.resolve(process.cwd(), 'cache', 'routeData.json');
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read data' });
    }
}
