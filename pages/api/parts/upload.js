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

// Helper function to sanitize filename
const sanitizeFilename = (name) => {
  return name
    .toLowerCase()
    .replace(/\.[^/.]+$/, '')     // Remove file extension
    .replace(/\s+/g, '_');        // Replace spaces with underscores
};

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

    // Extract original file extension (e.g., jpg, pdf)
    const originalExtension = file.originalFilename?.split('.').pop();

    // Use provided name or fallback to original filename, and sanitize it
    const rawName = fields.name?.toString().trim() || file.originalFilename;
    const cleanedName = sanitizeFilename(rawName);

    // Final filename: sanitized + extension
    const finalFilename = originalExtension ? `${cleanedName}.${originalExtension}` : cleanedName;

    const command = new PutObjectCommand({
      Bucket: 'parts',
      Key: finalFilename,
      Body: fileContent,
      ContentType: file.mimetype,
    });

    await s3.send(command);

    // Clean up temp file
    fs.unlinkSync(file.filepath);

    res.status(200).json({
      name: finalFilename,
      url: `${process.env.R2_ENDPOINT}/parts/${finalFilename}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload Part' });
  }
}
