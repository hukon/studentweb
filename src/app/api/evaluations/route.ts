import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    if (!classId) return NextResponse.json({ error: 'classId is required' }, { status: 400 });

    const data = await query(
      `SELECT e.*, s.name as student_name 
       FROM students s 
       LEFT JOIN evaluations e ON s.id = e.student_id 
       WHERE s.class_id = ? 
       ORDER BY s.name ASC`,
      [classId]
    );

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch evaluations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { evaluations } = await request.json();
    if (!Array.isArray(evaluations)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Upsert logic. Since we just have standard properties, we'll iterate.
    for (const record of evaluations) {
      if (!record.student_id) continue;
      
      const exists = await query('SELECT id FROM evaluations WHERE student_id = ?', [record.student_id]);
      
      if (exists.length > 0) {
        // Update
        await query(`
          UPDATE evaluations SET 
          oral_1=?, oral_2=?, oral_3=?,
          reading_1=?, reading_2=?, reading_3=?,
          comp_1=?, comp_2=?, comp_3=?,
          prod_1=?, prod_2=?, prod_3=?, prod_4=?,
          global_mastery=?
          WHERE student_id=?
        `, [
          record.oral_1, record.oral_2, record.oral_3,
          record.reading_1, record.reading_2, record.reading_3,
          record.comp_1, record.comp_2, record.comp_3,
          record.prod_1, record.prod_2, record.prod_3, record.prod_4,
          record.global_mastery,
          record.student_id
        ]);
      } else {
        // Insert
        await query(`
          INSERT INTO evaluations (
            student_id, oral_1, oral_2, oral_3,
            reading_1, reading_2, reading_3,
            comp_1, comp_2, comp_3,
            prod_1, prod_2, prod_3, prod_4,
            global_mastery
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          record.student_id, 
          record.oral_1, record.oral_2, record.oral_3,
          record.reading_1, record.reading_2, record.reading_3,
          record.comp_1, record.comp_2, record.comp_3,
          record.prod_1, record.prod_2, record.prod_3, record.prod_4,
          record.global_mastery
        ]);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save evaluations' }, { status: 500 });
  }
}
