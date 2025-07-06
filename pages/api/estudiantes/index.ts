import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';

interface Estudiante {
  id: string;
  nombre: string;
  primer_nombre: string;
  apellido: string;
  url_avatar: string | null;
  correo: string;
  telefono: string | null;
  fecha_matricula: string;
  direccion: string | null;
  nivel_grado: string | null;
  nombre_tutor: string | null;
  contacto_tutor: string | null;
  fecha_nacimiento: string | null;
  genero: 'masculino' | 'femenino' | 'otro' | null;
  id_clase: string | null;
  seccion: string | null;
  departamento: string | null;
  ciudad: string | null;
  correo_tutor: string | null;
  direccion_tutor: string | null;
  fecha_nacimiento_tutor: string | null;
}

interface EstudianteInput {
  nombre: string;
  primer_nombre: string;
  apellido: string;
  url_avatar?: string;
  correo: string;
  telefono?: string;
  fecha_matricula: string;
  direccion?: string;
  nivel_grado?: string;
  nombre_tutor?: string;
  contacto_tutor?: string;
  fecha_nacimiento?: string;
  genero?: 'masculino' | 'femenino' | 'otro';
  seccion?: string;
  departamento?: string;
  ciudad?: string;
  correo_tutor?: string;
  direccion_tutor?: string;
  fecha_nacimiento_tutor?: string;
}

function validateIdFormat(identifier: string): boolean {
  if (identifier.length !== 10) return false;
  const validTypes = ['T', 'S', 'O', 'A'];
  if (!validTypes.includes(identifier[0])) return false;
  const digits = identifier.slice(1);
  return /^\d{9}$/.test(digits);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const conn = await getConnection();

  try {
    switch (req.method) {
      case 'GET':
        const [estudiantes] = await conn.query(`
          SELECT 
            e.*,
            CONCAT(e.nivel_grado, ' - ', e.seccion) as clase_display
          FROM estudiantes e
          ORDER BY e.primer_nombre, e.apellido
        `);
        
        res.status(200).json(estudiantes);
        break;

      case 'POST':
        const estudianteData: EstudianteInput = req.body;
        
        if (!estudianteData.nombre || !estudianteData.correo) {
          return res.status(400).json({ error: 'Nombre y correo son requeridos' });
        }

        const [existingUser] = await conn.query(
          'SELECT id FROM estudiantes WHERE correo = ?',
          [estudianteData.correo]
        );

        if (Array.isArray(existingUser) && existingUser.length > 0) {
          return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        const estudianteId = `EST${Date.now()}${Math.random().toString(36).substr(2, 5)}`;

        const [result] = await conn.query(`
          INSERT INTO estudiantes (
            id, nombre, primer_nombre, apellido, url_avatar, correo, telefono,
            fecha_matricula, direccion, nivel_grado, nombre_tutor, contacto_tutor,
            fecha_nacimiento, genero, seccion, departamento, ciudad,
            correo_tutor, direccion_tutor, fecha_nacimiento_tutor
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          estudianteId,
          estudianteData.nombre,
          estudianteData.primer_nombre,
          estudianteData.apellido,
          estudianteData.url_avatar || null,
          estudianteData.correo,
          estudianteData.telefono || null,
          estudianteData.fecha_matricula,
          estudianteData.direccion || null,
          estudianteData.nivel_grado || null,
          estudianteData.nombre_tutor || null,
          estudianteData.contacto_tutor || null,
          estudianteData.fecha_nacimiento || null,
          estudianteData.genero || null,
          estudianteData.seccion || null,
          estudianteData.departamento || null,
          estudianteData.ciudad || null,
          estudianteData.correo_tutor || null,
          estudianteData.direccion_tutor || null,
          estudianteData.fecha_nacimiento_tutor || null
        ]);

        const hashedPassword = await bcrypt.hash('123456', 10);
        await conn.query(`
          INSERT INTO usuarios (identificador, correo, contrasena, rol, tema)
          VALUES (?, ?, ?, 'estudiante', 'claro')
        `, [estudianteId, estudianteData.correo, hashedPassword]);

        res.status(201).json({ 
          mensaje: 'Estudiante creado exitosamente',
          id: estudianteId 
        });
        break;

      default:
        res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error en API de estudiantes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    conn.release();
  }
} 