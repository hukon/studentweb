import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const id = params.id;
  try {
    const data = await request.json();
    
    // Convert boolean values to integers for Neon fallback if needed, though pg handles booleans properly.
    const updates = [
      data.name,
      data.dob || null,
      data.bio || null,
      data.comprehension_orale ? 1 : 0,
      data.ecriture ? 1 : 0,
      data.vocabulaire ? 1 : 0,
      data.grammaire ? 1 : 0,
      data.conjugaison ? 1 : 0,
      data.production_ecrite ? 1 : 0,
      data.category1 || null,
      id
    ];

    await query(`
      UPDATE students SET 
        name = ?, 
        dob = ?, 
        bio = ?,
        comprehension_orale = ?,
        ecriture = ?,
        vocabulaire = ?,
        grammaire = ?,
        conjugaison = ?,
        production_ecrite = ?,
        category1 = ?
      WHERE id = ?
    `, updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

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
