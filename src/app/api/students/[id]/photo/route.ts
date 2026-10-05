import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

const MAX_PHOTO_BYTES = 200 * 1024;

// A WebP file starts with "RIFF" <4-byte size> "WEBP"
function isWebp(bytes: Uint8Array) {
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));
  return bytes.length > 12 && ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP';
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const rows = await query<{ photo: Buffer | null }>('SELECT photo FROM students WHERE id = ?', [id]);
    const photo = rows[0]?.photo;
    if (!photo) return new Response(null, { status: 404 });

    return new Response(new Uint8Array(photo), {
      headers: {
        'Content-Type': 'image/webp',
        // The URL carries ?v=<photo_updated_at>, so a new photo is a new URL
        'Cache-Control': 'private, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch photo' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const bytes = new Uint8Array(await request.arrayBuffer());
    if (bytes.length === 0) {
      return NextResponse.json({ error: 'Empty file' }, { status: 400 });
    }
    if (bytes.length > MAX_PHOTO_BYTES) {
      return NextResponse.json({ error: 'Photo too large (max 200 KB)' }, { status: 400 });
    }
    if (!isWebp(bytes)) {
      return NextResponse.json({ error: 'Photo must be a WebP image' }, { status: 400 });
    }

    const updated = await query<{ photo_updated_at: string }>(
      'UPDATE students SET photo = ?, photo_updated_at = NOW() WHERE id = ? RETURNING photo_updated_at',
      [Buffer.from(bytes), id]
    );
    if (updated.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, photo_updated_at: updated[0].photo_updated_at });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save photo' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    await query('UPDATE students SET photo = NULL, photo_updated_at = NULL WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove photo' }, { status: 500 });
  }
}
