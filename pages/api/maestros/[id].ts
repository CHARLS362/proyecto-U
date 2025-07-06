import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID del profesor es requerido' });
  }

  const conn = await getConnection();

  try {
    switch (req.method) {
      case 'GET':
        const [profesores] = await conn.query(`
          SELECT 
            p.*,
            CONCAT(p.clase, ' - ', p.seccion) as clase_display
          FROM profesores p
          WHERE p.id = ?
        `, [id]);

        if (!Array.isArray(profesores) || profesores.length === 0) {
          return res.status(404).json({ error: 'Profesor no encontrado' });
        }

        res.status(200).json(profesores[0]);
        break;

      case 'PUT':
        const updateData = req.body;
        
        const [existingTeacher] = await conn.query(
          'SELECT id FROM profesores WHERE id = ?',
          [id]
        );

        if (!Array.isArray(existingTeacher) || existingTeacher.length === 0) {
          return res.status(404).json({ error: 'Profesor no encontrado' });
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

        const query = `UPDATE profesores SET ${updateFields.join(', ')} WHERE id = ?`;
        updateValues.push(id);

        await conn.query(query, updateValues);

        res.status(200).json({ mensaje: 'Profesor actualizado exitosamente' });
        break;

      case 'DELETE':
        const [teacherToDelete] = await conn.query(
          'SELECT id FROM profesores WHERE id = ?',
          [id]
        );

        if (!Array.isArray(teacherToDelete) || teacherToDelete.length === 0) {
          return res.status(404).json({ error: 'Profesor no encontrado' });
        }

        await conn.query('DELETE FROM usuarios WHERE identificador = ?', [id]);
        
        await conn.query('DELETE FROM profesores WHERE id = ?', [id]);

        res.status(200).json({ mensaje: 'Profesor eliminado exitosamente' });
        break;

      default:
        res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error en API de profesor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    conn.release();
  }
} 