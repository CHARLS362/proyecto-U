import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID de curso requerido' });
  }

  const conn = await getConnection();

  try {
    switch (req.method) {
      case 'GET': {
        const [cursos] = await conn.query('SELECT * FROM cursos WHERE id = ?', [id]);
        if (!Array.isArray(cursos) || cursos.length === 0) {
          return res.status(404).json({ error: 'Curso no encontrado' });
        }
        res.status(200).json(cursos[0]);
        break;
      }
      case 'PUT': {
        const updateData = req.body;
        const [existing] = await conn.query('SELECT id FROM cursos WHERE id = ?', [id]);
        if (!Array.isArray(existing) || existing.length === 0) {
          return res.status(404).json({ error: 'Curso no encontrado' });
        }

        const updateFields = Object.keys(updateData)
          .filter(key => updateData[key] !== undefined)
          .map(key => `${key} = ?`);
        const updateValues = Object.keys(updateData)
          .filter(key => updateData[key] !== undefined)
          .map(key => updateData[key]);

        if (updateFields.length === 0) {
          return res.status(400).json({ error: 'No hay campos para actualizar' });
        }

        const query = `UPDATE cursos SET ${updateFields.join(', ')} WHERE id = ?`;
        updateValues.push(id);

        await conn.query(query, updateValues);

        res.status(200).json({ mensaje: 'Curso actualizado exitosamente' });
        break;
      }
      case 'DELETE': {
        const [existing] = await conn.query('SELECT id FROM cursos WHERE id = ?', [id]);
        if (!Array.isArray(existing) || existing.length === 0) {
          return res.status(404).json({ error: 'Curso no encontrado' });
        }
        await conn.query('DELETE FROM cursos WHERE id = ?', [id]);
        res.status(200).json({ mensaje: 'Curso eliminado exitosamente' });
        break;
      }
      default:
        res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error en API de curso:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    conn.release();
  }
}
