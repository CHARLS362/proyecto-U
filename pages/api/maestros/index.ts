import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';

interface Profesor {
  id: string;
  primer_nombre: string;
  apellido: string;
  url_avatar: string | null;
  correo: string;
  numero_telefono: string | null;
  direccion: string | null;
  fecha_nacimiento: string | null;
  genero: string | null;
  clase: string | null;
  seccion: string | null;
  materia_relacionada: string | null;
  contacto_referencia: string | null;
  relacion_referencia: string | null;
  estado: 'Activo' | 'Inactivo';
}

interface ProfesorInput {
  primer_nombre: string;
  apellido: string;
  correo: string;
  url_avatar?: string;
  numero_telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  genero?: string;
  clase?: string;
  seccion?: string;
  materia_relacionada?: string;
  contacto_referencia?: string;
  relacion_referencia?: string;
  estado?: 'Activo' | 'Inactivo';
}

function validateIdFormat(identifier: string): boolean {
  if (identifier.length !== 11) return false;
  const validTypes = ['T', 'S', 'O', 'A'];
  if (!validTypes.includes(identifier[0])) return false;
  const digits = identifier.slice(1);
  return /^\d{10}$/.test(digits);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const conn = await getConnection();

  try {
    switch (req.method) {
      case 'GET':
        const [profesores] = await conn.query(`
          SELECT 
            p.*,
            CONCAT(p.clase, ' - ', p.seccion) as clase_display
          FROM profesores p
          ORDER BY p.primer_nombre, p.apellido
        `);
        
        res.status(200).json(profesores);
        break;

      case 'POST':
        const profesorData: ProfesorInput = req.body;
        
        if (!profesorData.primer_nombre || !profesorData.apellido || !profesorData.correo) {
          return res.status(400).json({ error: 'Nombre, apellido y correo son requeridos' });
        }

        const [existingUser] = await conn.query(
          'SELECT id FROM profesores WHERE correo = ?',
          [profesorData.correo]
        );

        if (Array.isArray(existingUser) && existingUser.length > 0) {
          return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        const { generateUniqueId } = require('../../../src/lib/idGenerator');
        const profesorId = generateUniqueId('T');

        const [result] = await conn.query(`
          INSERT INTO profesores (
            id, primer_nombre, apellido, url_avatar, correo, numero_telefono,
            direccion, fecha_nacimiento, genero, clase, seccion, materia_relacionada,
            contacto_referencia, relacion_referencia, estado
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          profesorId,
          profesorData.primer_nombre,
          profesorData.apellido,
          profesorData.url_avatar || null,
          profesorData.correo,
          profesorData.numero_telefono || null,
          profesorData.direccion || null,
          profesorData.fecha_nacimiento || null,
          profesorData.genero || null,
          profesorData.clase || null,
          profesorData.seccion || null,
          profesorData.materia_relacionada || null,
          profesorData.contacto_referencia || null,
          profesorData.relacion_referencia || null,
          profesorData.estado || 'Activo'
        ]);

        let defaultPassword = '123456';
        
        if (profesorData.fecha_nacimiento) {
          try {
            const [anio, mes, dia] = profesorData.fecha_nacimiento.split('-');
            defaultPassword = `${dia.padStart(2, '0')}${mes.padStart(2, '0')}${anio}`;
          } catch (error) {
            console.error('Error formateando fecha para contraseña:', error);
          }
        }
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        await conn.query(`
          INSERT INTO usuarios (identificador, correo, contrasena, rol, tema)
          VALUES (?, ?, ?, 'profesor', 'claro')
        `, [profesorId, profesorData.correo, hashedPassword]);

        res.status(201).json({ 
          mensaje: 'Profesor creado exitosamente',
          id: profesorId 
        });
        break;

      default:
        res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error en API de profesores:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    conn.release();
  }
}
