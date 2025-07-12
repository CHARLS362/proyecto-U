import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID de estudiante requerido' });
  }
  const conn = await getConnection();
  try {
    if (req.method === 'GET') {
      const [rows] = await conn.query(
        `SELECT c.*, ec.progreso
         FROM cursos c
         JOIN estudiantes_cursos ec ON c.id = ec.id_curso
         WHERE ec.id_estudiante = ?`,
        [id]
      );
      return res.status(200).json(rows);
    }
    res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error al obtener cursos del estudiante:', error);
    res.status(500).json({ error: 'Error al obtener cursos del estudiante', detalle: (error as Error).message });
  } finally {
    conn.release();
  }
} 