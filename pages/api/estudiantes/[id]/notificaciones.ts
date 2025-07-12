import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end('Método no permitido');

  try {
    const [avisos] = await db.query(`
      SELECT titulo, fecha, remitente 
      FROM comunicados 
      ORDER BY fecha DESC 
      LIMIT 3
    `);
    const [anuncios] = await db.query(`
      SELECT titulo, fecha 
      FROM anuncios_cursos 
      ORDER BY fecha DESC 
      LIMIT 3
    `);

    res.status(200).json({ avisos, anuncios });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener notificaciones', detalle: error });
  }
}
