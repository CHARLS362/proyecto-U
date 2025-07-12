import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') return res.status(405).end('Método no permitido');

  try {
    const [rows]: any = await db.query(
      `SELECT ROUND(AVG(promedio), 2) AS promedio_general 
       FROM notas_bimestre 
       WHERE id_estudiante = ?`,
      [id]
    );

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener promedio', detalle: error });
  }
}
