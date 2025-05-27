import {
  S3Client,
  ListObjectsV2Command,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';

const s3 = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  region: 'auto',
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const allowedOrigins = ['http://localhost:5173', 'https://gmpol.com'];

export default async function handler(req, res) {
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const listCommand = new ListObjectsV2Command({ Bucket: 'machines' });
    const listResponse = await s3.send(listCommand);

    const files = await Promise.all(
      (listResponse.Contents || []).map(async (item) => {
        let metadata = {
          description: '',
          features: [],
          specifications: {},
        };

        try {
          const headCommand = new HeadObjectCommand({
            Bucket: 'machines',
            Key: item.Key,
          });
          const headResponse = await s3.send(headCommand);
          const raw = headResponse.Metadata || {};

          metadata = {
            description: raw.description || '',
            features: raw.features ? JSON.parse(raw.features) : [],
            specifications: raw.specifications
              ? JSON.parse(raw.specifications)
              : {},
          };
        } catch (err) {
          console.warn(`Failed to get metadata for ${item.Key}:`, err.message);
        }

        return {
          name: item.Key,
          url: `${process.env.R2_ENDPOINT}/machines/${item.Key}`,
          size: item.Size,
          lastModified: item.LastModified,
          metadata,
        };
      })
    );

    res.status(200).json(files);
  } catch (err) {
    console.error('Error listing machines:', err);
    res.status(500).json({ error: 'Failed to list machines' });
  }
}
