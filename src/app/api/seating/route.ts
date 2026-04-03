import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    if (!classId) return NextResponse.json({ error: 'classId is required' }, { status: 400 });

    const seats = await query('SELECT * FROM seating WHERE class_id = ?', [classId]);
    return NextResponse.json(seats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch seats' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { classId, seats } = await request.json();
    if (!classId || !Array.isArray(seats)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // A transaction-like flow: Delete old seats for this class, then insert new ones
    // Note: in a true production app, use actual DB transactions.
    await query('DELETE FROM seating WHERE class_id = ?', [classId]);

    for (const seat of seats) {
      if (seat.student_id) {
        await query(
          'INSERT INTO seating (class_id, student_id, row_num, col_num, seat_num) VALUES (?, ?, ?, ?, ?)',
          [classId, seat.student_id, seat.row_num, seat.col_num, seat.seat_num]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save seating plan' }, { status: 500 });
  }
}
