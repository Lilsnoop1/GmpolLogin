import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable();
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileContent = fs.readFileSync(file.filepath);

    // Use name from form field if provided, else fallback to original filename
    const customFilename = fields.name?.toString().trim() || file.originalFilename;

    const command = new PutObjectCommand({
      Bucket: 'instruments',
      Key: customFilename,
      Body: fileContent,
      ContentType: file.mimetype,
    });

    await s3.send(command);

    // Clean up the temporary file
    fs.unlinkSync(file.filepath);

    res.status(200).json({
      name: customFilename,
      url: `${process.env.R2_ENDPOINT}/instruments/${customFilename}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload instrument' });
  }
}
