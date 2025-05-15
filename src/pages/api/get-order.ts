// /src/pages/api/get-order.ts
import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ error: "Missing id" });
  }

  try {
    const row = db.prepare(
      `SELECT plastic_qty, metal_qty, textile_qty FROM Orders WHERE id = ?`
    ).get(id);

    if (!row) return res.status(404).json({ error: "Order not found" });

    res.status(200).json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}