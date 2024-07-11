import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  tags?: {
    [key: string]: string;
  };
}

interface OverpassResponse {
  elements: OverpassElement[];
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { latitude, longitude, radius } = req.query;

  if (!latitude || !longitude || !radius) {
    res.status(400).json({ error: 'Latitude, longitude, and radius are required' });
    return;
  }

  const overpassQuery = `
    [out:json];
    (
      node["route"="hiking"](around:${radius},${latitude},${longitude});
      way["route"="hiking"](around:${radius},${latitude},${longitude});
      relation["route"="hiking"](around:${radius},${latitude},${longitude});
      node["route"="bicycle"](around:${radius},${latitude},${longitude});
      way["route"="bicycle"](around:${radius},${latitude},${longitude});
      relation["route"="bicycle"](around:${radius},${latitude},${longitude});
      node["route"="mtb"](around:${radius},${latitude},${longitude});
      way["route"="mtb"](around:${radius},${latitude},${longitude});
      relation["route"="mtb"](around:${radius},${latitude},${longitude});
      node["tourism"="attraction"](around:${radius},${latitude},${longitude});
      way["tourism"="attraction"](around:${radius},${latitude},${longitude});
      relation["tourism"="attraction"](around:${radius},${latitude},${longitude});
    );
    out center;
  `;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data from Overpass API');
    }
    const data = (await response.json()) as OverpassResponse;

    // Filter out elements with the name "Unbenannte Stelle", names that are only numbers, or names that contain numbers and 1-4 letters, and deduplicate by id
    const filteredElements = Array.from(
      new Map(
        data.elements
          .filter((element) =>
            element.tags?.name &&
            element.tags.name !== 'Unbenannte Stelle' &&
            !/^\d+$/.test(element.tags.name) &&
            !/^\d+[a-zA-Z]{1,4}$/.test(element.tags.name)
          )
          .map((element) => [element.id, element])
      ).values()
    );

    res.status(200).json(filteredElements);
  } catch (error) {
    console.error('Error fetching data from Overpass API:', error);
    res.status(500).json({ error: 'Error fetching data from Overpass API' });
  }
};

export default handler;
