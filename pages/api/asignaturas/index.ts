import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const conn = await getConnection();
      
      const [tableExists] = await conn.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = DATABASE() 
        AND table_name = 'materias_reportes_notas'
      `);
      
      if ((tableExists as any[])[0].count === 0) {
        const predefinedSubjects = [
          { id: 1, name: 'Matemáticas' },
          { id: 2, name: 'Lenguaje y Literatura' },
          { id: 3, name: 'Ciencias Naturales' },
          { id: 4, name: 'Ciencias Sociales' },
          { id: 5, name: 'Inglés' },
          { id: 6, name: 'Educación Física' },
          { id: 7, name: 'Arte y Cultura' },
          { id: 8, name: 'Tecnología' },
          { id: 9, name: 'Religión' },
          { id: 10, name: 'Música' }
        ];
        
        conn.release();
        return res.status(200).json(predefinedSubjects);
      }
      
      const [rows] = await conn.query(`
        SELECT 
          id,
          materia as nombre
        FROM materias_reportes_notas
        ORDER BY materia
      `);
      conn.release();

      const subjects = (rows as any[]).map((row: any) => ({
        id: row.id,
        name: row.nombre
      }));

      res.status(200).json(subjects);
    } catch (error) {
      console.error('Error al obtener materias:', error);
      
      const fallbackSubjects = [
        { id: 1, name: 'Matemáticas' },
        { id: 2, name: 'Lenguaje y Literatura' },
        { id: 3, name: 'Ciencias Naturales' },
        { id: 4, name: 'Ciencias Sociales' },
        { id: 5, name: 'Inglés' },
        { id: 6, name: 'Educación Física' },
        { id: 7, name: 'Arte y Cultura' },
        { id: 8, name: 'Tecnología' },
        { id: 9, name: 'Religión' },
        { id: 10, name: 'Música' }
      ];
      
      res.status(200).json(fallbackSubjects);
    }
    return;
  }

  return res.status(405).json({ error: 'Método no permitido' });
} 