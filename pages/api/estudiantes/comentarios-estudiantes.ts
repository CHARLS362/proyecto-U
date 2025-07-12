import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const conn = await getConnection();
  try {
    if (req.method === 'GET') {
      const { id_estudiante } = req.query;
      if (!id_estudiante || typeof id_estudiante !== 'string') {
        return res.status(400).json({ error: 'id_estudiante requerido' });
      }
      const [rows] = await conn.query(
        'SELECT id, id_estudiante, autor, comentario, fecha FROM comentarios_estudiantes WHERE id_estudiante = ? ORDER BY fecha DESC',
        [id_estudiante]
      );
      return res.status(200).json(rows);
    }
    if (req.method === 'POST') {
      const { id_estudiante, autor, comentario } = req.body;
      if (!id_estudiante || !autor || !comentario) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }
      await conn.query(
        'INSERT INTO comentarios_estudiantes (id_estudiante, autor, comentario) VALUES (?, ?, ?)',
        [id_estudiante, autor, comentario]
      );
      return res.status(201).json({ mensaje: 'Comentario agregado' });
    }
    res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    conn.release();
  }
} 