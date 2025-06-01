import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  region: 'auto',
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const allowedOrigins = ['http://localhost:5173', 'https://gmpol.com','https://www.gmpol.com',
  'https://www.globalmedicalpartsonline.com',
  'https://globalmedicalpartsonline.com'
];

export default async function handler(req, res) {

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await s3.send(new ListObjectsV2Command({ Bucket: 'parts' }));
    const files = (data.Contents || []).map((item) => ({
      name: item.Key,
      url: `${process.env.R2_ENDPOINT}/parts/${item.Key}`,
    }));
    res.status(200).json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list Parts' });
  }
} 