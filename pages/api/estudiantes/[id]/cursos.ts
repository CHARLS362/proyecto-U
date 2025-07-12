import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') return res.status(405).end('Método no permitido');

  try {
    const [rows] = await db.query(`
      SELECT c.id, c.nombre, ec.progreso
      FROM estudiantes_cursos ec
      JOIN cursos c ON c.id = ec.id_curso
      WHERE ec.id_estudiante = ?
    `, [id]);

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cursos del estudiante', detalle: error });
  }
}
