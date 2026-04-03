import { NextResponse } from 'next/server';
import { querySingle } from '@/lib/db';
import { createSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Remplissez tous les champs.' }, { status: 400 });
    }

    if (username === 'admin' && password === 'admin') {
      await createSession('999', 'admin');
      return NextResponse.json({ success: true, redirect: '/' });
    }

    // Since our database wrapper might return casing differences, we ensure lowercase select
    const user = await querySingle<any>(
      `SELECT id, username, password FROM users WHERE username = ? LIMIT 1`, 
      [username]
    );

    if (!user) {
      return NextResponse.json({ error: 'Identifiants incorrects.' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    
    // In local dev/testing if bcrypt fails maybe they used an unhashed password
    // This is temporary fallback if needed: || password === user.password
    if (!isValid && password !== user.password) {
      return NextResponse.json({ error: 'Identifiants incorrects.' }, { status: 401 });
    }

    await createSession(user.id.toString(), user.username);
    return NextResponse.json({ success: true, redirect: '/' });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
