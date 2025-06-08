import { db } from '../../../lib/firebaseAdmin';

const allowedOrigins = [
  'http://localhost:5173',
  'https://gmpol.com',
  'https://www.gmpol.com',
  'https://www.globalmedicalpartsonline.com',
  'https://globalmedicalpartsonline.com',
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
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const snapshot = await db.collection('machines').get();
      const machines = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log({machines});
      res.status(200).json({ machines });
    } catch (error) {
      console.error('Error fetching machines:', error);
      res.status(500).json({ error: 'Failed to fetch machines' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description, features, specifications, url,extension } = req.body;

      if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required' });
      }

      const slug = encodeURIComponent(name.trim().toLowerCase().replace(/\s+/g, '_'));

      const docRef = await db.collection('machines').add({
        name,
        slug,
        metadata: {
          description,
          features,
          specifications,
        },
        extension: '.'+extension,
        url,
        createdAt: new Date().toISOString(),
      });

      res.status(200).json({
        message: 'Machine added successfully',
        id: docRef.id,
      });
    } catch (error) {
      console.error('Error adding machine:', error);
      res.status(500).json({ error: 'Failed to add machine' });
    }
  }else if (req.method === 'DELETE') {
    try {
      const { slug } = req.query;
      console.log(slug);
      

      if (!slug) {
        return res.status(400).json({ error: 'Slug is required' });
      }

      const snapshot = await db.collection('machines').where('slug', '==', slug).get();

      if (snapshot.empty) {
        return res.status(404).json({ error: 'Machine not found' });
      }

      const batch = db.batch();
      snapshot.forEach(doc => batch.delete(doc.ref));
      await batch.commit();

      res.status(200).json({ message: 'Machine deleted successfully' });
    } catch (error) {
      console.error('Error deleting machine:', error);
      res.status(500).json({ error: 'Failed to delete machine' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
