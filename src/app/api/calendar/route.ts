import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const events = await query('SELECT * FROM holidays ORDER BY date ASC');
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, date, notes } = await request.json();
    if (!title || !date) {
      return NextResponse.json({ error: 'Title and Date required' }, { status: 400 });
    }
    
    await query('INSERT INTO holidays (title, date, notes) VALUES (?, ?, ?)', [title, date, notes || null]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
