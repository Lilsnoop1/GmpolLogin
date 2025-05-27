import { db } from '../../../lib/firebaseAdmin';

const allowedOrigins = ['http://localhost:5173', 'https://gmpol.com','https://www.gmpol.com',
  'https://www.globalmedicalpartsonline.com',
  'https://globalmedicalpartsonline.com'
];

export default async function handler(req, res) {
  // Set CORS headers
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


  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const snapshot = await db.collection('machines').get();
      const machines = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      res.status(200).json({ machines });
    } catch (error) {
      console.error('Error fetching machines:', error);
      res.status(500).json({ error: 'Failed to fetch machines' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description, features, specifications, url } = req.body;

      if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required' });
      }

      const docRef = await db.collection('machines').add({
        name,
        description,
        features,
        specifications,
        url,
        createdAt: new Date().toISOString()
      });

      res.status(200).json({ 
        message: 'Machine added successfully',
        id: docRef.id 
      });
    } catch (error) {
      console.error('Error adding machine:', error);
      res.status(500).json({ error: 'Failed to add machine' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}