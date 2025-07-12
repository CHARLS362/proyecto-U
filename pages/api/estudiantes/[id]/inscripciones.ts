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
        `SELECT ec.*, c.nombre as nombre_curso, c.descripcion as descripcion_curso, c.codigo as codigo_curso
         FROM estudiantes_cursos ec
         JOIN cursos c ON ec.id_curso = c.id
         WHERE ec.id_estudiante = ?`,
        [id]
      );
      return res.status(200).json(rows);
    }
    if (req.method === 'POST') {
      const { id_curso } = req.body;
      if (!id_curso) {
        return res.status(400).json({ error: 'ID de curso requerido' });
      }
      // Validar que el curso corresponde al grado/nivel del estudiante
      // 1. Obtener el estudiante
      const [estRows] = await conn.query(
        `SELECT nivel, grado FROM estudiantes WHERE id = ?`,
        [id]
      );
      if (!Array.isArray(estRows) || estRows.length === 0) {
        return res.status(404).json({ error: 'Estudiante no encontrado' });
      }
      const estudiante = (estRows as any)[0];
      const nivel = (estudiante.nivel || '').toLowerCase();
      const grado = estudiante.grado;
      let expectedIdClase = null;
      if (nivel === 'primaria') {
        expectedIdClase = `${grado}-pri`;
      } else if (nivel === 'secundaria') {
        expectedIdClase = `${grado}-sec`;
      }
      // 2. Obtener el curso
      const [cursoRows] = await conn.query(
        `SELECT id_clase FROM cursos WHERE id = ?`,
        [id_curso]
      );
      if (!Array.isArray(cursoRows) || cursoRows.length === 0) {
        return res.status(404).json({ error: 'Curso no encontrado' });
      }
      const curso = (cursoRows as any)[0];
      if (String(curso.id_clase) !== String(expectedIdClase)) {
        return res.status(400).json({ error: 'No puede inscribirse en cursos ajenos a su grado/nivel.' });
      }
      // Verificar si ya existe la inscripción
      const [existing] = await conn.query(
        `SELECT * FROM estudiantes_cursos WHERE id_estudiante = ? AND id_curso = ?`,
        [id, id_curso]
      );
      if (Array.isArray(existing) && existing.length > 0) {
        return res.status(400).json({ error: 'El estudiante ya está inscrito en este curso' });
      }
      // Insertar nueva inscripción
      await conn.query(
        `INSERT INTO estudiantes_cursos (id_estudiante, id_curso, progreso)
         VALUES (?, ?, 0)`,
        [id, id_curso]
      );
      // Actualizar cantidad de estudiantes matriculados en el curso
      await conn.query(
        `UPDATE cursos 
         SET cantidad_estudiantes_matriculados = cantidad_estudiantes_matriculados + 1
         WHERE id = ?`,
        [id_curso]
      );
      return res.status(201).json({ mensaje: 'Inscripción realizada correctamente' });
    }
    res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error en inscripciones:', error);
    res.status(500).json({ error: 'Error en inscripciones', detalle: (error as Error).message });
  } finally {
    conn.release();
  }
} 