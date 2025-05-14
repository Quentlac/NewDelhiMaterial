import db from '@/lib/db';

export default function handler(req, res) {
  try {
    const materials = db.prepare('SELECT * FROM materials').all();
    res.status(200).json(materials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la lecture de la base de données' });
  }
}