import AWS from 'aws-sdk';
import 'dotenv/config';

const BUCKET_NAME = process.env.NEXT_PUBLIC_CLOUDFLARE_BUCKET_NAME;
const CLOUDFLARE_ACCOUNT_ID = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;

const s3 = new AWS.S3({
  endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
  secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  region: 'auto',
  signatureVersion: 'v4'
});

export default async function handler(req, res) {
  try {
    const data = await s3.getObject({
      Bucket: BUCKET_NAME,
      Key: 'routeData.json'
    }).promise();

    const fileContents = data.Body.toString('utf-8');
    const jsonData = JSON.parse(fileContents);
    res.status(200).json(jsonData);
  } catch (error) {
    console.error('Error reading data from Cloudflare R2:', error.message);
    res.status(500).json({ error: 'Failed to read data' });
  }
}
