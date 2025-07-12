import mysql from 'mysql2/promise';

// Configuración usando los datos proporcionados
const pool = mysql.createPool({
  host: 'MYSQL1003.site4now.net',
  user: 'abb6c5_gestion',
  password: 'gestion23',
  database: 'db_abb6c5_gestion',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Función para obtener una conexión del pool
export async function getConnection() {
  return pool.getConnection();
}

// También puedes exportar el pool para consultas directas
export default pool;
