-- Student profile photos (Postgres/Neon). Safe to run more than once.
ALTER TABLE students ADD COLUMN IF NOT EXISTS photo BYTEA;
ALTER TABLE students ADD COLUMN IF NOT EXISTS photo_updated_at TIMESTAMP;
