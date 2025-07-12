import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID de curso requerido' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const conn = await getConnection();

  try {

    const [estudiantes] = await conn.query(`
      SELECT 
        ec.id_estudiante,
        ec.id_curso,
        ec.progreso,
        e.nombre,
        e.primer_nombre,
        e.apellido,
        e.url_avatar,
        e.correo,
        e.nivel,
        e.grado,
        e.seccion
      FROM estudiantes_cursos ec
      INNER JOIN estudiantes e ON ec.id_estudiante = e.id
      WHERE ec.id_curso = ?
      ORDER BY e.apellido, e.primer_nombre
    `, [id]);

    res.status(200).json(estudiantes);
  } catch (error) {
    console.error('Error al obtener estudiantes del curso:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    conn.release();
  }
} 