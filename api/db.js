const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'web',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos establecida correctamente');
    connection.release();
    return true;
  } catch (error) {
    console.error(' Error al conectar a la base de datos:', error.message);
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};