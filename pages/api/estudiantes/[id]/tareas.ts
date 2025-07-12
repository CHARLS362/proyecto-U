import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') return res.status(405).end('Método no permitido');

  try {
    const [rows] = await db.query(`
      SELECT t.titulo, t.fecha_entrega, t.estado, c.nombre AS curso
      FROM estudiantes_cursos ec
      JOIN tareas t ON t.id_curso = ec.id_curso
      JOIN cursos c ON c.id = t.id_curso
      WHERE ec.id_estudiante = ? AND t.fecha_entrega >= CURDATE()
      ORDER BY t.fecha_entrega ASC
      LIMIT 3
    `, [id]);

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tareas', detalle: error });
  }
}
