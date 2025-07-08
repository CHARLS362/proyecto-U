import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID del estudiante es requerido' });
  }

  const conn = await getConnection();

  try {
    switch (req.method) {
      case 'GET':
        const [estudiantes] = await conn.query(`
          SELECT 
            e.*,
            CONCAT(e.nivel_grado, ' - ', e.seccion) as clase_display
          FROM estudiantes e
          WHERE e.id = ?
        `, [id]);

        if (!Array.isArray(estudiantes) || estudiantes.length === 0) {
          return res.status(404).json({ error: 'Estudiante no encontrado' });
        }

        res.status(200).json(estudiantes[0]);
        break;

      case 'PUT':
        const updateData = req.body;
        
        const [existingStudent] = await conn.query(
          'SELECT id FROM estudiantes WHERE id = ?',
          [id]
        );

        if (!Array.isArray(existingStudent) || existingStudent.length === 0) {
          return res.status(404).json({ error: 'Estudiante no encontrado' });
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

        const query = `UPDATE estudiantes SET ${updateFields.join(', ')} WHERE id = ?`;
        updateValues.push(id);

        await conn.query(query, updateValues);

        res.status(200).json({ mensaje: 'Estudiante actualizado exitosamente' });
        break;

      case 'DELETE':
        const [studentToDelete] = await conn.query(
          'SELECT id FROM estudiantes WHERE id = ?',
          [id]
        );

        if (!Array.isArray(studentToDelete) || studentToDelete.length === 0) {
          return res.status(404).json({ error: 'Estudiante no encontrado' });
        }

        await conn.query('DELETE FROM usuarios WHERE identificador = ?', [id]);
        
        await conn.query('DELETE FROM estudiantes WHERE id = ?', [id]);

        res.status(200).json({ mensaje: 'Estudiante eliminado exitosamente' });
        break;

      default:
        res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error en API de estudiante:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    conn.release();
  }
} 