import { Pool as PgPool } from '@neondatabase/serverless';
import mysql from 'mysql2/promise';

/**
 * DB wrapper for Next.js to support either PostgreSQL (Neon) or MySQL (InfinityFree legacy).
 * We check process.env.DATABASE_URL. If it contains 'postgres', we use @neondatabase/serverless.
 * Otherwise, we fallback to mysql2.
 */

let pgPool: PgPool | null = null;
let mysqlPool: mysql.Pool | null = null;

const dbType = process.env.DATABASE_URL?.startsWith('postgres') ? 'postgres' : 'mysql';

if (dbType === 'postgres') {
  if (!pgPool) {
    pgPool = new PgPool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  }
} else {
  if (!mysqlPool) {
    mysqlPool = mysql.createPool({
      host: process.env.DB_HOST || 'sql200.infinityfree.com',
      user: process.env.DB_USER || 'if0_41562686',
      password: process.env.DB_PASSWORD || 'iThwtyAhjmXwcN',
      database: process.env.DB_NAME || 'if0_41562686_student',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
}

/**
 * Executes a query securely using either underlying DB.
 */
export async function query<T>(text: string, params: any[] = []): Promise<T[]> {
  if (dbType === 'postgres') {
    // Convert ? to $1, $2 for postgres if the query uses basic ? placeholders
    let pgText = text;
    let i = 1;
    pgText = pgText.replace(/\?/g, () => `$${i++}`);
    
    // Quick hack for boolean maps if needed for schema matching, but simple selects should work
    const res = await pgPool!.query(pgText, params);
    return res.rows as T[];
  } else {
    const [rows] = await mysqlPool!.execute(text, params);
    return rows as T[];
  }
}

export async function querySingle<T>(text: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows.length > 0 ? rows[0] : null;
}
