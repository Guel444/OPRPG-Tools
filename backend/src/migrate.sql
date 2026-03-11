-- ============================================================
-- MIGRATE — adiciona colunas que faltam no schema original
-- Seguro rodar múltiplas vezes (IF NOT EXISTS)
-- ============================================================

-- ── CHARACTERS ───────────────────────────────────────────────
ALTER TABLE characters
  ADD COLUMN IF NOT EXISTS use_pd          BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS pd_max          INTEGER,
  ADD COLUMN IF NOT EXISTS pd_atual        INTEGER,
  ADD COLUMN IF NOT EXISTS player_name     VARCHAR(100),
  ADD COLUMN IF NOT EXISTS personality     TEXT,
  ADD COLUMN IF NOT EXISTS appearance      TEXT,
  ADD COLUMN IF NOT EXISTS motivations     TEXT,
  ADD COLUMN IF NOT EXISTS connections     TEXT,
  ADD COLUMN IF NOT EXISTS secrets         TEXT,
  ADD COLUMN IF NOT EXISTS trait_brave     BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS trait_curious   BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS trait_skeptic   BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS trait_pragmatic BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS trait_empath    BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS trait_lone_wolf BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS trait_leader    BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS trait_haunted   BOOLEAN DEFAULT FALSE;

-- Preencher pd para personagens existentes
UPDATE characters SET pd_max = pe_max, pd_atual = pe_atual WHERE pd_max IS NULL;

-- ── CREATURES — colunas que o seed usa mas não existem no schema ──
ALTER TABLE creatures
  ADD COLUMN IF NOT EXISTS abilities   JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS image_url   TEXT;

-- Corrigir CHECK de creature_type para aceitar novos valores
ALTER TABLE creatures DROP CONSTRAINT IF EXISTS creatures_creature_type_check;
ALTER TABLE creatures ADD CONSTRAINT creatures_creature_type_check
  CHECK (creature_type IN ('criatura','animal','pessoa','ameaça','humanoide','morto-vivo','relíquia'));

-- Corrigir CHECK de size para aceitar 'média' (variante feminina)
ALTER TABLE creatures DROP CONSTRAINT IF EXISTS creatures_size_check;
ALTER TABLE creatures ADD CONSTRAINT creatures_size_check
  CHECK (size IN ('minúsculo','pequeno','médio','média','grande','enorme','colossal'));

-- ── RITUALS — colunas que o seed usa ─────────────────────────
ALTER TABLE rituals
  ADD COLUMN IF NOT EXISTS disciple_effect   TEXT,
  ADD COLUMN IF NOT EXISTS true_name_effect  TEXT,
  ADD COLUMN IF NOT EXISTS area              TEXT;

-- ── ORIGINS — coluna power_name que o seed usa ───────────────
ALTER TABLE origins
  ADD COLUMN IF NOT EXISTS power_name        VARCHAR(100),
  ADD COLUMN IF NOT EXISTS power_description TEXT;

-- ── ITEMS — tipo 'protecao' e 'geral' e 'paranormal' e 'amaldicado' ──
ALTER TABLE items DROP CONSTRAINT IF EXISTS items_item_type_check;
ALTER TABLE items ADD CONSTRAINT items_item_type_check
  CHECK (item_type IN (
    'arma_simples','arma_tatica','arma_pesada',
    'protecao','protecao_leve','protecao_pesada',
    'geral','paranormal','amaldicado',
    'item_geral','item_paranormal','item_amaldicoado','recurso'
  ));

-- ── POWERS — tipo 'paranormal' e 'intencao' ──────────────────
ALTER TABLE powers DROP CONSTRAINT IF EXISTS powers_power_type_check;
ALTER TABLE powers ADD CONSTRAINT powers_power_type_check
  CHECK (power_type IN (
    'geral','combatente','especialista','ocultista','sobrevivente',
    'paranormal','paranormal_sangue','paranormal_morte',
    'paranormal_conhecimento','paranormal_energia','paranormal_medo',
    'intencao'
  ));

-- prerequisites é JSONB no schema mas o seed passa texto simples ('VIG 2', 'afinidade Sangue')
-- Converter para TEXT
ALTER TABLE powers ALTER COLUMN prerequisites TYPE TEXT USING prerequisites::text;

-- special_rules nos itens é JSONB no schema mas o seed passa texto descritivo
-- Converter para TEXT
ALTER TABLE items ALTER COLUMN special_rules TYPE TEXT USING special_rules::text;

-- ── CREATURES — resistances/vulnerabilities/immunities são JSONB no schema
-- mas o seed passa texto descritivo ('Balístico, corte...')
-- Converter para TEXT
ALTER TABLE creatures ALTER COLUMN resistances TYPE TEXT USING resistances::text;
ALTER TABLE creatures ALTER COLUMN vulnerabilities TYPE TEXT USING vulnerabilities::text;
ALTER TABLE creatures ALTER COLUMN immunities TYPE TEXT USING immunities::text;