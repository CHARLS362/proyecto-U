import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end('Método no permitido');

  try {
    const [rows] = await db.query(`
      SELECT id, titulo, fecha, tipo 
      FROM eventos_escolares 
      WHERE fecha >= CURDATE()
      ORDER BY fecha ASC
      LIMIT 5
    `);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener eventos', detalle: error });
  }
}
