-- Adds each mortal's likes/dislikes to the pairings, and lets the broadcast queue post into a tab
-- without the announcement header (used to tell angels when their mortal's info changes).
-- Run once, after 0003_tab_names.sql, and BEFORE deploying the code that uses it:
--   npx wrangler d1 execute angel-mortal --remote --file=migrations/0004_mortal_info.sql
-- A database created from the current schema.sql already has these columns; running this
-- against it (or twice) fails with "duplicate column name", which is harmless.
ALTER TABLE pairings ADD COLUMN mortal_likes TEXT;
ALTER TABLE pairings ADD COLUMN mortal_dislikes TEXT;
ALTER TABLE pairings_backup ADD COLUMN mortal_likes TEXT;
ALTER TABLE pairings_backup ADD COLUMN mortal_dislikes TEXT;
ALTER TABLE broadcast_queue ADD COLUMN thread_id INTEGER;
ALTER TABLE broadcast_queue ADD COLUMN announce INTEGER NOT NULL DEFAULT 1;
