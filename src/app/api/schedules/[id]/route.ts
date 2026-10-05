import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const { class_id, day_of_week, start_time, end_time, subject, teacher, room } = await request.json();
    if (!class_id || !day_of_week || !start_time || !end_time || !subject?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (end_time <= start_time) {
      return NextResponse.json({ error: 'End time must be after start time' }, { status: 400 });
    }

    await query(
      'UPDATE schedules SET class_id = ?, day_of_week = ?, start_time = ?, end_time = ?, subject = ?, teacher = ?, room = ? WHERE id = ?',
      [class_id, day_of_week, start_time, end_time, subject.trim(), teacher?.trim() || null, room?.trim() || null, id]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update schedule entry' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    await query('DELETE FROM schedules WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete schedule entry' }, { status: 500 });
  }
}
