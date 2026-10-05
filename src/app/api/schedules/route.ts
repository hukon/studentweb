import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const schedules = await query(`
      SELECT s.id, s.class_id, c.name AS class_name, s.day_of_week,
             s.start_time, s.end_time, s.subject, s.teacher, s.room
      FROM schedules s
      JOIN classes c ON s.class_id = c.id
      ORDER BY s.day_of_week, s.start_time
    `);
    return NextResponse.json(schedules);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { class_id, day_of_week, start_time, end_time, subject, teacher, room } = await request.json();
    if (!class_id || !day_of_week || !start_time || !end_time || !subject?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (end_time <= start_time) {
      return NextResponse.json({ error: 'End time must be after start time' }, { status: 400 });
    }

    await query(
      'INSERT INTO schedules (class_id, day_of_week, start_time, end_time, subject, teacher, room) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [class_id, day_of_week, start_time, end_time, subject.trim(), teacher?.trim() || null, room?.trim() || null]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create schedule entry' }, { status: 500 });
  }
}
