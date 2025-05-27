// pages/api/machines/description/[slug].ts
import { db } from '../../../../lib/firebaseAdmin';


const allowedOrigins = ['http://localhost:5173', 'https://gmpol.com','https://www.gmpol.com',
  'https://www.globalmedicalpartsonline.com',
  'https://globalmedicalpartsonline.com'
];
export default async function handler(req, res) {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid slug parameter' });
  }

  try {
    const snapshot = await db.collection('machines').where('slug', '==', slug).get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'Machine not found' });
    }

    const data = snapshot.docs[0].data();
    return res.status(200).json({ data });
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
