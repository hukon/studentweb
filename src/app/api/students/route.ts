import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    if (!classId) return NextResponse.json({ error: 'classId is required' }, { status: 400 });

    const students = await query('SELECT * FROM students WHERE class_id = ? ORDER BY name ASC', [classId]);
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { class_id, name } = await request.json();
    if (!class_id || !name?.trim()) {
      return NextResponse.json({ error: 'class_id and name are required' }, { status: 400 });
    }
    
    await query('INSERT INTO students (class_id, name) VALUES (?, ?)', [class_id, name.trim()]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}
