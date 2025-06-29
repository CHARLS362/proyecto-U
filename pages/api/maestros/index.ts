import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const {
    identificador,
    nombre,
    apellido,
    padre,
    asignatura_id,
    genero,
    fecha_nacimiento,
    imagen = 'default_user.png',
    telefono,
    correo,
    direccion,
    ciudad,
    codigo_postal,
    estado,
    clase_id,
  } = req.body;

  if (
    !identificador || !nombre || !apellido || !asignatura_id || !genero ||
    !fecha_nacimiento || !telefono || !correo || !direccion ||
    !ciudad || !codigo_postal || !estado || !clase_id
  ) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  try {
    const conn = await getConnection();
    const [result] = await conn.query(
      `INSERT INTO profesores (
        identificador, nombre, apellido, padre, asignatura_id, genero, fecha_nacimiento,
        imagen, telefono, correo, direccion, ciudad, codigo_postal, estado, clase_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        identificador, nombre, apellido, padre, asignatura_id, genero, fecha_nacimiento,
        imagen, telefono, correo, direccion, ciudad, codigo_postal, estado, clase_id
      ]
    );
    conn.release();

    res.status(201).json({ mensaje: 'Profesor agregado correctamente', id: result.insertId });
  } catch (error) {
    console.error('Error al agregar maestro:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}