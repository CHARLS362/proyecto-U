import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/lib/db';

interface Clase {
  id: string;
  nombre: string;
  seccion: string;
  cuota: number;
}

interface ClaseInput {
  nombre: string;
  seccion: string;
  cuota: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const conn = await getConnection();

  try {
    switch (req.method) {
      case 'GET':
        const [clases] = await conn.query(`
          SELECT 
            id,
            nombre,
            seccion,
            cuota,
            CONCAT(nombre, ' - ', seccion) as displayName
          FROM clases
          ORDER BY nombre, seccion
        `);
        
        res.status(200).json(clases);
        break;

      case 'POST':
        const claseData: ClaseInput = req.body;
        
        if (!claseData.nombre || !claseData.seccion || !claseData.cuota) {
          return res.status(400).json({ error: 'Nombre, sección y cuota son requeridos' });
        }

        const [existingClass] = await conn.query(
          'SELECT id FROM clases WHERE nombre = ? AND seccion = ?',
          [claseData.nombre, claseData.seccion]
        );

        if (Array.isArray(existingClass) && existingClass.length > 0) {
          return res.status(400).json({ error: 'Ya existe una clase con este nombre y sección' });
        }

        const claseId = `CLASE${Date.now()}${Math.random().toString(36).substr(2, 5)}`;

        const [result] = await conn.query(`
          INSERT INTO clases (id, nombre, seccion, cuota)
          VALUES (?, ?, ?, ?)
        `, [claseId, claseData.nombre, claseData.seccion, claseData.cuota]);

        res.status(201).json({ 
          mensaje: 'Clase creada exitosamente',
          id: claseId 
        });
        break;

      default:
        res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error en API de clases:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    conn.release();
  }
} 