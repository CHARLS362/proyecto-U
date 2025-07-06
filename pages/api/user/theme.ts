import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { identificador, tema } = req.body;

  if (!identificador || !tema) {
    return res.status(400).json({ error: 'Identificador y tema son requeridos' });
  }

  if (!['claro', 'oscuro'].includes(tema)) {
    return res.status(400).json({ error: 'Tema debe ser "claro" u "oscuro"' });
  }

  const conn = await getConnection();

  try {
    const [existingUser] = await conn.query(
      'SELECT id FROM usuarios WHERE identificador = ?',
      [identificador]
    );

    if (!Array.isArray(existingUser) || existingUser.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await conn.query(
      'UPDATE usuarios SET tema = ? WHERE identificador = ?',
      [tema, identificador]
    );

    res.status(200).json({ 
      mensaje: 'Tema actualizado exitosamente',
      tema: tema 
    });
  } catch (error) {
    console.error('Error al actualizar tema:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    conn.release();
  }
} 