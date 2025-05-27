import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  region: 'auto',
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fileName } = req.query;
  if (!fileName) {
    return res.status(400).json({ error: 'File name is required' });
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: 'instruments',
      Key: fileName,
    });

    await s3.send(command);
    res.status(200).json({ message: 'Instrument deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete instrument' });
  }
} 