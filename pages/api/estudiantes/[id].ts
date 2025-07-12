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
            CONCAT(e.grado, '° de ', e.nivel) as clase_display
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
        try {
          // Primero verificar si el estudiante existe
          const [studentToDelete] = await conn.query(
            'SELECT id FROM estudiantes WHERE id = ?',
            [id]
          );

          if (!Array.isArray(studentToDelete) || studentToDelete.length === 0) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
          }

          // Eliminar registros relacionados en el orden correcto para evitar errores de clave foránea
          console.log('Eliminando registros relacionados para estudiante:', id);
          
          // 1. Eliminar de valores_puntuaciones_notas (si existe)
          await conn.query('DELETE vpn FROM valores_puntuaciones_notas vpn JOIN puntuaciones_notas pn ON vpn.id_puntuacion_nota = pn.id WHERE pn.id_estudiante = ?', [id]);
          
          // 2. Eliminar de puntuaciones_notas
          await conn.query('DELETE FROM puntuaciones_notas WHERE id_estudiante = ?', [id]);
          
          // 3. Eliminar de entradas_notas (si existe)
          await conn.query('DELETE en FROM entradas_notas en JOIN notas_bimestre nb ON en.id_nota_bimestre = nb.id WHERE nb.id_estudiante = ?', [id]);
          
          // 4. Eliminar de notas_bimestre
          await conn.query('DELETE FROM notas_bimestre WHERE id_estudiante = ?', [id]);
          
          // 5. Eliminar de registros_asistencia
          await conn.query('DELETE FROM registros_asistencia WHERE id_estudiante = ?', [id]);
          
          // 6. Eliminar de estudiantes_cursos
          await conn.query('DELETE FROM estudiantes_cursos WHERE id_estudiante = ?', [id]);
          
          // 7. Eliminar de entregas (si existe)
          await conn.query('DELETE FROM entregas WHERE id_estudiante = ?', [id]);
          
          // 8. Finalmente eliminar el estudiante
          await conn.query('DELETE FROM estudiantes WHERE id = ?', [id]);
          
          // 9. Eliminar el usuario asociado
          await conn.query('DELETE FROM usuarios WHERE identificador = ?', [id]);

          console.log('Estudiante eliminado exitosamente:', id);
          res.status(200).json({ mensaje: 'Estudiante eliminado exitosamente' });
        } catch (deleteError) {
          console.error('Error específico al eliminar estudiante:', deleteError);
          res.status(500).json({ error: 'Error al eliminar estudiante: ' + (deleteError as Error).message });
        }
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