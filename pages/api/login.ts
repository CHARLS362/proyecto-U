import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { correo, contrasena } = req.body;

  try {
    const conn = await getConnection();
    const [rows] = await conn.query(
      'SELECT * FROM usuarios WHERE correo = ?',
      [correo]
    );
    conn.release();

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = rows[0];
    const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    res.status(200).json({ mensaje: 'Login exitoso', usuario });
  } catch (error) {
    console.error('Error interno del servidor:', error);
    return res.status(500).json({
      error: 'Ocurrió un error inesperado. Por favor, intenta más tarde.',
    });
  }
}
