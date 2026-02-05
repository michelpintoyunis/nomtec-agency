-- RUN THIS IN SUPABASE SQL EDITOR TO ENABLE SORTING

-- 1. Add sort_order column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'sort_order') THEN 
        ALTER TABLE events ADD COLUMN sort_order INTEGER DEFAULT 0; 
    END IF; 
END $$;

-- 2. Initialize sort_order for existing events based on their ID (descending) so they have a default order
WITH ordered_events AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) - 1 as new_order
  FROM events
)
UPDATE events
SET sort_order = ordered_events.new_order
FROM ordered_events
WHERE events.id = ordered_events.id
  AND (events.sort_order IS NULL OR events.sort_order = 0);

-- 3. Ensure Realtime is enabled for the table (check publication)
-- This usually requires UI interaction, but we can try to alter the table replica identity
ALTER TABLE events REPLICA IDENTITY FULL;

-- 4. Grant update permissions if needed (usually handled by policies, but good to check)
-- This assumes you have RLS enabled. If policies are blocking updates, you might need to check them.
