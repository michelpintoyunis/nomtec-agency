-- Copia y pega esto en el SQL Editor de Supabase para actualizar tu tabla de eventos

-- 1. Añadir las columnas nuevas para los partidos
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS home_team text,
ADD COLUMN IF NOT EXISTS away_team text,
ADD COLUMN IF NOT EXISTS home_team_abbr text,
ADD COLUMN IF NOT EXISTS away_team_abbr text,
ADD COLUMN IF NOT EXISTS home_team_logo text,
ADD COLUMN IF NOT EXISTS away_team_logo text,
ADD COLUMN IF NOT EXISTS home_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS away_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS match_start_timestamp bigint;

-- 2. Asegurarse de que las columnas existentes permitan los nuevos datos
-- (Por ejemplo, status ahora aceptará 'first_half', 'halftime', etc.)
-- Si usaste un ENUM para status, tendrías que alterarlo. Si es TEXT, esto no es necesario, pero no hace daño.
ALTER TABLE events ALTER COLUMN status TYPE text;
