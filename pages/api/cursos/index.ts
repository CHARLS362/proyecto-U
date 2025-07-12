import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const conn = await getConnection();

  try {
    switch (req.method) {
      case 'GET': {
        const [cursos] = await conn.query(`
          SELECT * FROM cursos ORDER BY nombre
        `);
        res.status(200).json(cursos);
        break;
      }
      case 'POST': {
        const {
          codigo, nombre, descripcion, horario, instructor, id_instructor,
          avatar_instructor, cantidad_estudiantes_matriculados, capacidad,
          departamento, url_plan_estudios, id_clase
        } = req.body;

        if (!codigo || !nombre || capacidad == null || cantidad_estudiantes_matriculados == null) {
          return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const id = `CURSO${Date.now()}${Math.random().toString(36).substr(2, 5)}`;

        await conn.query(`
          INSERT INTO cursos (
            id, codigo, nombre, descripcion, horario, instructor, id_instructor,
            avatar_instructor, cantidad_estudiantes_matriculados, capacidad,
            departamento, url_plan_estudios, id_clase
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          id, codigo, nombre, descripcion || null, horario || null, instructor || null, id_instructor || null,
          avatar_instructor || null, cantidad_estudiantes_matriculados, capacidad,
          departamento || null, url_plan_estudios || null, id_clase || null
        ]);

        res.status(201).json({ mensaje: 'Curso creado exitosamente', id });
        break;
      }
      default:
        res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error en API de cursos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    conn.release();
  }
}
