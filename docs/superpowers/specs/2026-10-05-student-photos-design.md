# Student photos — design

Date: 2026-10-05

## Goal

Let teachers add a profile photo for each student, and show it in a photo grid ("photo wall") and as small round avatars across the app. No old data is migrated; the Neon database starts empty.

## Decisions

- Storage: photos live in the Neon Postgres database, not in file storage. Vercel's filesystem is read-only, and Vercel Blob is not usable until the Vercel login/scope problem is fixed. A school-sized set (~200 photos at 20–40 KB) is small.
- Photos are resized in the browser before upload, so the server only stores small images.
- Photos are **never** included in any PDF or export. (User decision, 2026-10-05.)
- Out of scope for this piece: bulk upload by file name, MySQL support for the photo columns (the app now runs on Neon).

## Data

Add to `students` (script in `sql/add_student_photo.sql`, run once):

- `photo BYTEA NULL`
- `photo_updated_at TIMESTAMP NULL`

The existing `pic_path` column is left untouched and unused.

`GET /api/students?classId=` stops using `SELECT *`. It selects the current columns except `photo`, plus `(photo IS NOT NULL) AS has_photo` and `photo_updated_at`. Image bytes are never part of list responses.

## API

All routes sit behind the existing login check in `src/proxy.ts`.

- `GET /api/students/[id]/photo` — returns the bytes as `image/webp` with `Cache-Control: private, max-age=31536000, immutable`. Clients request it as `?v=<photo_updated_at>`, so a new photo gets a new URL. Returns 404 when there is no photo.
- `PUT /api/students/[id]/photo` — request body is the raw WebP. Rejects with 400 if the body is empty, larger than 200 KB, or does not start with the `RIFF....WEBP` header. Sets `photo` and `photo_updated_at = now()`. Returns 404 if the student does not exist.
- `DELETE /api/students/[id]/photo` — sets both columns to NULL.

## Browser components

- `Avatar` — props: student id, name, `has_photo`, `photo_updated_at`, size. Shows `<img>` from the photo URL, or a coloured circle with the initials when there is no photo or the image fails to load.
- `PhotoDialog` — opens from a card or avatar. Choose a file, drag and drop, or use the camera on a phone (`capture`). Square crop with drag and zoom. On save it draws the crop to a 400×400 canvas, exports WebP (quality 0.8), and uploads it with `PUT`. Also offers "Remove photo" (`DELETE`).

## Where photos appear

- Classes & Étudiants: a toggle between *Liste* and *Mur de photos*. The wall is a responsive grid of cards (photo, name, change-photo button). The list view gets a small avatar per row. The view choice is remembered per browser.
- Seating chart and evaluations: small avatars next to student names.

## Errors

- File too large, not an image, or upload failed: show a message in the dialog; the previous photo is left unchanged.
- Image fails to load: fall back to initials.

## Testing

The project has no test framework. Verification: TypeScript check, real HTTP requests against the dev server for GET/PUT/DELETE (including rejected oversize and non-WebP bodies), and a visual check of the three views in a browser.
