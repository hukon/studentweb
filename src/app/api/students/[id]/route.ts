import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const id = params.id;
  try {
    await query('DELETE FROM students WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
