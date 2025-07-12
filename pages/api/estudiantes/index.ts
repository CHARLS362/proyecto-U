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
  nivel: 'Primaria' | 'Secundaria';
  grado: number;
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
  nivel: 'Primaria' | 'Secundaria';
  grado: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const conn = await getConnection();

  try {
    switch (req.method) {
      case 'GET':
        const [estudiantes] = await conn.query(`
          SELECT 
            e.*,
            CONCAT(e.grado, '° de ', e.nivel) as clase_display
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

        const [lastStudent] = await conn.query('SELECT id FROM estudiantes ORDER BY id DESC LIMIT 1') as any;
        let nextId = 1;
        
        if (Array.isArray(lastStudent) && lastStudent.length > 0) {
          const lastId = lastStudent[0].id;
          const lastNumber = parseInt(lastId.replace('S', ''));
          nextId = lastNumber + 1;
        }
        
        const estudianteId = `S${nextId.toString().padStart(3, '0')}`;

        const [result] = await conn.query(`
          INSERT INTO estudiantes (
            id, nombre, primer_nombre, apellido, url_avatar, correo, telefono,
            fecha_matricula, direccion, nombre_tutor, contacto_tutor,
            fecha_nacimiento, genero, seccion, departamento, ciudad,
            correo_tutor, direccion_tutor, fecha_nacimiento_tutor, nivel, grado
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          estudianteData.nombre_tutor || null,
          estudianteData.contacto_tutor || null,
          estudianteData.fecha_nacimiento || null,
          estudianteData.genero || null,
          estudianteData.seccion || null,
          estudianteData.departamento || null,
          estudianteData.ciudad || null,
          estudianteData.correo_tutor || null,
          estudianteData.direccion_tutor || null,
          estudianteData.fecha_nacimiento_tutor || null,
          estudianteData.nivel,
          estudianteData.grado
        ]);

        let defaultPassword = '123456';
        if (estudianteData.fecha_nacimiento) {
          try {
            const [anio, mes, dia] = estudianteData.fecha_nacimiento.split('-');
            defaultPassword = `${dia.padStart(2, '0')}${mes.padStart(2, '0')}${anio}`;
          } catch (error) {
            console.error('Error formateando fecha para contraseña:', error);
          }
        }
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
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