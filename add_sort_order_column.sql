-- Add sort_order column to events table
ALTER TABLE events 
ADD COLUMN sort_order INTEGER DEFAULT 0;

-- Optionally, initialize with existing ID order
-- UPDATE events SET sort_order = id;
