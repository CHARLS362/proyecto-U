import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';

interface Usuario {
  id: number;
  identificador: string;
  correo: string;
  contrasena: string;
  rol: 'admin' | 'profesor' | 'estudiante' | 'propietario';
  tema: 'claro' | 'oscuro';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { correo, contrasena } = req.body;


  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
  }

  try {
    const conn = await getConnection();
    const [rows] = await conn.query(
      'SELECT id, identificador, correo, contrasena, rol, tema FROM usuarios WHERE correo = ?',
      [correo]
    );
    conn.release();

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = rows[0] as Usuario;
    const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }


    const { contrasena: _, ...usuarioSinPassword } = usuario;

    res.status(200).json({ 
      mensaje: 'Login exitoso', 
      usuario: usuarioSinPassword,
      rol: usuario.rol,
      tema: usuario.tema
    });
  } catch (error) {
    console.error('Error interno del servidor:', error);
    return res.status(500).json({
      error: 'Ocurrió un error inesperado. Por favor, intenta más tarde.',
    });
  }
}
