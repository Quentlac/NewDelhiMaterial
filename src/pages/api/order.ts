import db from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { plastic = 0, metal = 0, textile = 0 } = req.body;

  const pricePerKg = {
    plastic: 1.4,
    metal: 2.6,
    textile: 4.3,
  };

  const total_price = plastic * pricePerKg.plastic + metal * pricePerKg.metal + textile * pricePerKg.textile;
  const date_created = new Date().toISOString();

  try {
    const result = db.prepare(
      `INSERT INTO Orders (date_created, plastic_qty, metal_qty, textile_qty, total_price)
       VALUES (?, ?, ?, ?, ?)`
    ).run(date_created, plastic, metal, textile, total_price);

    db.prepare(`UPDATE stock SET quantity = quantity - ? WHERE material = 'plastic'`).run(plastic);
    db.prepare(`UPDATE stock SET quantity = quantity - ? WHERE material = 'metal'`).run(metal);
    db.prepare(`UPDATE stock SET quantity = quantity - ? WHERE material = 'textile'`).run(textile);

    res.status(200).json({ message: 'Commande enregistrée avec succès.', id: result.lastInsertRowid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'enregistrement de la commande." });
  }
}