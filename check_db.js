const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'sql200.infinityfree.com',
    user: process.env.DB_USER || 'if0_41562686',
    password: process.env.DB_PASSWORD || 'iThwtyAhjmXwcN',
    database: process.env.DB_NAME || 'if0_41562686_student',
  });
  
  try {
    const [rows] = await pool.execute('SELECT * FROM users');
    console.log(rows);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
main();
