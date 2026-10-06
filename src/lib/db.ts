import { neon } from '@neondatabase/serverless';
import mysql from 'mysql2/promise';

/**
 * DB wrapper for Next.js to support either PostgreSQL (Neon) or MySQL (InfinityFree legacy).
 * We check process.env.DATABASE_URL. If it contains 'postgres', we use @neondatabase/serverless.
 * Otherwise, we fallback to mysql2.
 */

// Neon's HTTP driver: one HTTPS request per query, no WebSocket handshake.
// Much faster than a pooled connection for the short, single-statement queries this app runs.
let pgSql: ReturnType<typeof neon> | null = null;
let mysqlPool: mysql.Pool | null = null;

const dbType = process.env.DATABASE_URL?.startsWith('postgres') ? 'postgres' : 'mysql';

if (dbType === 'postgres') {
  pgSql = neon(process.env.DATABASE_URL!);
} else {
  if (!mysqlPool) {
    mysqlPool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
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
    const rows = await pgSql!.query(pgText, params);
    return rows as T[];
  } else {
    const [rows] = await mysqlPool!.execute(text, params);
    return rows as T[];
  }
}

export async function querySingle<T>(text: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows.length > 0 ? rows[0] : null;
}
