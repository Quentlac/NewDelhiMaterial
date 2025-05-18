import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const orders = db.prepare('SELECT * FROM Orders ORDER BY id ASC').all();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des commandes.' });
  }
}